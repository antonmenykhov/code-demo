import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { DocumentItem } from './entities/document.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DocumentReport } from './dto/document-report.dto';
import { AccessTokenRepresentationFull } from 'src/keycloak/dto/access-token-representation-full.interface';
import { PdfWorkerService } from 'src/pdf-worker/pdf-worker.service';
import { DelegationService } from 'src/delegation/delegation.service';
import { UserSignService } from 'src/user-sign/user-sign.service';
import axios from 'axios';
import { SignDto } from 'src/html-render/dto/sign.sto';
import { AttachmentTransformerService } from 'src/attachment-transformer/attachment-transformer.service';
import { RegnumberDto } from 'src/html-render/dto/regnumber.dto';
import { FileSaverService } from 'src/file-saver/file-saver.service';
import { readFile } from 'node:fs/promises';
import { HasdoneDto } from 'src/html-render/dto/hasdone.dto';
import { DocumentReadingMarkService } from 'src/document-reading-mark/document-reading-mark.service';
import { DocumentAdditionalContractorService } from 'src/document-additional-contractor/document-additional-contractor.service';
import { Emailer } from 'src/emailer/entities/emailer.entity';

@Injectable()
export class DocumentService extends DefaultCrud<
  DocumentItem,
  CreateDocumentDto,
  UpdateDocumentDto
> {
  constructor(
    @InjectDataSource() private datasource: DataSource,
    private pdfWorkerService: PdfWorkerService,
    private delegationService: DelegationService,
    private userSignService: UserSignService,
    private attachmentTransformerService: AttachmentTransformerService,
    private fileSaverService: FileSaverService,
    private readingMarkService: DocumentReadingMarkService,
    private documentAdditionalContractorsService: DocumentAdditionalContractorService,
  ) {
    super(DocumentItem, datasource);
  }
  private documentRepository = this.datasource.getRepository(DocumentItem);

  private async getReportForWorkerAndManager(
    isIncoming: boolean,
    parsedToken: AccessTokenRepresentationFull,
    year: number,
  ) {
    return (await this.getReportForInitier(isIncoming, year)).filter(
      (docuemnt) =>
        docuemnt.delegations.some(
          (delegation) =>
            delegation.fromId === parsedToken.sub ||
            delegation.toId === parsedToken.sub,
        ) ||
        docuemnt.parent?.delegations.some(
          (delegation) =>
            delegation.fromId === parsedToken.sub ||
            delegation.toId === parsedToken.sub,
        ),
    );
  }

  private async getReportForInitier(isIncoming: boolean, year: number) {
    return await this.repository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.company', 'company')
      .leftJoinAndSelect('document.contractor', 'contractor')
      .leftJoinAndSelect('document.delegations', 'delegation')
      .leftJoinAndSelect('document.child', 'child')
      .leftJoinAndSelect('document.readingMarks', 'mark')
      .leftJoinAndSelect('document.parent', 'parent')
      .leftJoinAndSelect('parent.delegations', 'parentDelegation')
      .where('document.isIncoming=:isIncoming', { isIncoming })
      .andWhere('EXTRACT(YEAR from document.created)=:year', { year })
      .orderBy('document.id', 'DESC')
      .addOrderBy('delegation.id', 'ASC')
      .getMany();
  }

  async getDocumentsReport(
    isIncoming: boolean,
    parsedToken: AccessTokenRepresentationFull,
    year: number,
  ) {
    const isInitier =
      parsedToken.resource_access.documents.roles.includes('Initier');
    const isManager =
      parsedToken.resource_access.documents.roles.includes('Manager');

    return (
      isInitier || isManager
        ? await this.getReportForInitier(isIncoming, year)
        : await this.getReportForWorkerAndManager(isIncoming, parsedToken, year)
    ).map<DocumentReport>((document) => {
      const lastDelegation =
        document.delegations[document.delegations.length - 1];

      return {
        ...document,
        dateTo: lastDelegation ? this.getDateFormat(lastDelegation.date) : '',
        reportName: this.fileSaverService.getDocumentName(document),
        createdFormated: this.getDateFormat(document.created),
        companyName: document.company?.name || '',
        contractorName: document.contractor?.name || '',
        delegations: [
          ...document.delegations,
          ...(isManager
            ? document.parent?.delegations.filter(
                (del) => del.isNeedAprooving && del.fromId === parsedToken.sub,
              ) || []
            : []),
        ],
      };
    });
  }
  getDateFormat(dateString: string) {
    const date = new Date(dateString);
    return `${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}.${
      date.getMonth() + 1 > 9
        ? date.getMonth() + 1
        : '0' + (date.getMonth() + 1)
    }.${date.getFullYear()} г.`;
  }

  async findOne(
    id: number,
    parsedToken?: AccessTokenRepresentationFull,
  ): Promise<DocumentItem> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: {
        company: { stamp: true },
        contractor: true,
        delegations: {
          comments: true,
        },
        child: {
          additionalContractors: true,
          additionalAttachments: true,
          additionalSigners: true,
        },
        parent: { delegations: { comments: true } },
        attachment: true,
        reciept: true,
        readingMarks: true,
        additionalContractors: { contractor: true, contractorDirector: true },
        additionalAttachments: true,
        additionalSigners: true,
        emailers: true,
      },
      order: {
        delegations: { id: 'ASC' },
        additionalContractors: { id: 'ASC' },
      },
    });

    if (
      parsedToken &&
      parsedToken.resource_access.documents.roles.includes('Manager')
    ) {
      document.delegations = [
        ...document.delegations,
        ...(
          document.parent?.delegations.filter(
            (del) => del.fromId === parsedToken.sub,
          ) || []
        ).map((del) => {
          del.parentId = undefined;
          return del;
        }),
      ];
    }

    return document;
  }

  async signDocument(id: number, userInfo: AccessTokenRepresentationFull) {
    const document = await this.findOne(id);
    if (document) {
      const delegation = document.delegations.find(
        (del) => del.toId === userInfo.sub && del.isActive,
      );
      if (delegation)
        this.delegationService.update(delegation.id, {
          isActive: false,
          isAprooved: true,
          isNeedAprooving: true,
        });
      return await this.update(id, { isStamped: true });
    }
    throw new HttpException(
      { message: 'Вероятно нет файла для штампа' },
      HttpStatus.BAD_REQUEST,
    );
  }

  getSmallFio(fullFio: string) {
    const fioArr = fullFio.split(' ');
    if (fioArr.length > 1) fioArr.push(' ');

    return `${fioArr[0]} ${fioArr
      .slice(1)
      .map((part) => part[0])
      .join('. ')}`;
  }

  private async addReadedMark(
    userInfo: AccessTokenRepresentationFull,
    token: string,
    document: DocumentItem,
    withoutAnswer: boolean,
  ) {
    const sign = await this.userSignService.findByUserId(userInfo.sub);
    const signHtml = (
      await axios.post(
        `http://localhost:${process.env.PORT}/sign`,
        <SignDto>{
          date: this.getDateFormat(JSON.parse(JSON.stringify(new Date()))),
          fio: this.getSmallFio(userInfo.family_name),
          signSrc: sign
            ? `http://localhost:${process.env.PORT}/attachment/${sign.attachmentId}?token=Bearer ${token}`
            : undefined,
          withoutAnswer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer',
        },
      )
    ).data;
    const signPdf =
      await this.attachmentTransformerService.transformHtmlToPdf(signHtml);
    await this.pdfWorkerService.addHasReaded(
      document.attachment.filePath,
      signPdf,
      this.needInsertPage(document),
      document.readingMarks.length,
    );
  }

  async setDocumentReaded(
    id: number,
    userInfo: AccessTokenRepresentationFull,
    token: string,
    withoutAnswer: boolean = false,
  ) {
    const document = await this.findOne(id);
    const newMark = await this.readingMarkService.createMark({
      date: JSON.parse(JSON.stringify(new Date())),
      userId: userInfo.sub,
      documentId: document.id,
      withoutAnswer,
    });
    if (newMark) {
      await this.addReadedMark(userInfo, token, document, withoutAnswer);
      await this.fileSaverService.orginizeFile(await this.findOne(id));
    }
    return;
  }

  async toggleCompleted(id: number) {
    const document = await this.findOne(id);
    const delegationsForClosing = document.delegations.filter(
      (delegation) => delegation.isActive,
    );
    for await (const delegation of delegationsForClosing) {
      await this.delegationService.update(delegation.id, {
        isActive: false,
        isAprooved: true,
        isReaded: true,
      });
    }
    return await this.update(id, { isCompleted: !document.isCompleted });
  }

  async registerDocument(id: number, token: string) {
    const document = await this.findOne(id);
    const regnumber =
      document.regnumber ||
      (await this.getNextRegNumber(
        document.isIncoming,
        document.companyId,
        document.created,
      ));
    const result = await this.update(id, { isRegistered: true, regnumber });
    if (document && document.isIncoming && document.attachmentId) {
      const regnumberHtml = (
        await axios.post(
          `http://localhost:${process.env.PORT}/regnumber`,
          <RegnumberDto>{
            company: document.company.name,
            date: this.getDateFormat(document.created),
            number: `Вх. № ${regnumber}`,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'arraybuffer',
          },
        )
      ).data;
      const regnumberPdf =
        await this.attachmentTransformerService.transformHtmlToPdf(
          regnumberHtml,
        );
      await this.pdfWorkerService.addRegnumber(
        document.attachment.filePath,
        regnumberPdf,
        this.needInsertPage(document),
      );
    }
    if (document.isIncoming === false && document.parentId)
      await this.addHasDone(
        document.parentId,
        regnumber,
        document.created,
        token,
      );
    return result;
  }

  async addHasDone(
    documentId: number,
    regnumber: number,
    date: string,
    token: string,
  ) {
    const document = await this.findOne(documentId);
    const regnumberHtml = (
      await axios.post(
        `http://localhost:${process.env.PORT}/hasdone`,
        <HasdoneDto>{
          contractNumber: `Исх. № ${regnumber} от ${this.getDateFormat(
            date,
          )} г.`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer',
        },
      )
    ).data;
    const regnumberPdf =
      await this.attachmentTransformerService.transformHtmlToPdf(regnumberHtml);
    await this.pdfWorkerService.addHasDone(
      document.attachment.filePath,
      regnumberPdf,
    );
    return await this.fileSaverService.orginizeFile(document);
  }

  async getNextRegNumber(
    isIncoming: boolean,
    companyId: number,
    created: string,
  ) {
    return (
      ((
        await this.repository
          .createQueryBuilder('document')
          .where('document.isIncoming=:isIncoming', { isIncoming })
          .andWhere('document.companyId=:companyId', { companyId })
          .andWhere('EXTRACT(YEAR from document.created)=:year', {
            year: new Date(created).getFullYear(),
          })
          .andWhere('document.regnumber != 0')
          .andWhere('document.groupLeaderId IS NULL')
          .orderBy('document.regnumber', 'DESC')
          .getOne()
      )?.regnumber || 0) + 1
    );
  }

  async deleteAndClearParentId(id: number) {
    const document = await this.findOne(id);
    if (document.isRegistered)
      throw new HttpException(
        { message: 'Документ зарегистрирован, удаление невозможно' },
        HttpStatus.BAD_REQUEST,
      );
    await this.update(id, { parentId: null });
    return this.remove(id);
  }

  async update(
    id: number,
    createDto: UpdateDocumentDto,
  ): Promise<UpdateDocumentDto & { id: number } & DocumentItem> {
    const result = await this.repository.save({
      id,
      additionalContractors: undefined,
      isExternalRegistered: false,
      ...createDto,
    });
    await this.documentAdditionalContractorsService.updateAllAdditionContractors(
      createDto.additionalContractors,
      id,
    );
    await this.fileSaverService.orginizeFile(await this.findOne(id));
    return result;
  }

  async create(
    createDto: CreateDocumentDto,
  ): Promise<CreateDocumentDto & DocumentItem> {
    const createdDocument = await this.repository.save({
      ...createDto,
      additionalContractors: undefined,
    });
    await this.documentAdditionalContractorsService.updateAllAdditionContractors(
      (createDto.additionalContractors || []).map((dto) => ({
        ...dto,
        documentId: createdDocument.id,
      })),
      createdDocument.id,
    );
    return createdDocument;
  }

  async getYears() {
    return this.repository
      .createQueryBuilder('document')
      .select(`DISTINCT EXTRACT(YEAR from document.created) as year`)
      .orderBy('year', 'ASC')
      .getRawMany();
  }

  async addExternalRegnumber(id: number, token: string) {
    const document = await this.findOne(id);
    if (
      document &&
      document.externalCreated &&
      document.externalRegnumber &&
      !document.isIncoming &&
      !document.recieptId
    ) {
      const regnumberHtml = (
        await axios.post(
          `http://localhost:${process.env.PORT}/regnumber`,
          <RegnumberDto>{
            company: `Получено ${document.contractor.name}`,
            date: this.getDateFormat(document.externalCreated),
            number: `Вх. № ${document.externalRegnumber}`,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'arraybuffer',
          },
        )
      ).data;
      const regnumberPdf =
        await this.attachmentTransformerService.transformHtmlToPdf(
          regnumberHtml,
        );
      await this.pdfWorkerService.addRegnumber(
        document.attachment.filePath,
        regnumberPdf,
        !document.isExternalRegistered,
      );
    } else {
      if (document.recieptId) {
        const recieptFile = await readFile(document.reciept.filePath);
        await this.pdfWorkerService.addReciept(
          document.attachment.filePath,
          recieptFile,
          !document.isExternalRegistered,
        );
      }
    }

    return await this.update(id, { isExternalRegistered: true });
  }

  private needInsertPage(documentItem: DocumentItem): boolean {
    return (
      (!documentItem.isRegistered && documentItem.readingMarks.length === 0) ||
      (documentItem.readingMarks.length > 0 &&
        documentItem.readingMarks.length % 8 === 0)
    );
  }

  async getCounts(userInfo: AccessTokenRepresentationFull) {
    const isInitier =
      userInfo.resource_access.documents.roles.includes('Initier');
    const isManager =
      userInfo.resource_access.documents.roles.includes('Manager');
    const docs = await this.repository
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.parent', 'parent')
      .leftJoinAndSelect('parent.delegations', 'parentDelegation')
      .where('doc.isCompleted=false')
      .leftJoinAndSelect('doc.delegations', 'delegation')
      .getMany();
    return {
      in: docs.filter(
        (doc) =>
          doc.isIncoming &&
          doc.delegations.some(
            (delegation) =>
              (delegation.toId === userInfo.sub &&
                delegation.isReaded === false) ||
              (delegation.fromId === userInfo.sub &&
                delegation.isNeedAprooving &&
                delegation.isAprooved === false),
          ),
      ).length,
      out: docs.filter(
        (doc) =>
          !doc.isIncoming &&
          (doc.delegations.some(
            (delegation) =>
              (delegation.toId === userInfo.sub &&
                delegation.isReaded === false) ||
              (delegation.fromId === userInfo.sub &&
                delegation.isNeedAprooving &&
                delegation.isAprooved === false),
          ) ||
            (isManager &&
              doc.parent?.delegations?.some(
                (delegation) =>
                  delegation.fromId === userInfo.sub &&
                  delegation.isNeedAprooving &&
                  delegation.isAprooved === false,
              ))),
      ).length,
    };
  }

  async addEmailSendedMark(
    document: DocumentItem,
    emailer: Emailer,
    count: number,
    token: string,
  ) {
    const emailerHtml = (
      await axios.post(
        `http://localhost:${process.env.PORT}/regnumber`,
        <RegnumberDto>{
          company: `Отправлено на эл. почту ${this.getDateFormat(
            emailer.created,
          )}`,
          date: '',
          number: emailer.toEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer',
        },
      )
    ).data;
    const emailerStamp =
      await this.attachmentTransformerService.transformHtmlToPdf(emailerHtml);

    await this.pdfWorkerService.addHasReaded(
      document.attachment.filePath,
      emailerStamp,
      (count > 0 && count % 8 === 0) || count === 0,
      count,
    );
  }

  async createCopy(parentDocumentId: number) {
    const parentDocument = await this.findOne(parentDocumentId);
    if (!parentDocument.isIncoming) throw BadRequestException;
    return await this.repository.save({
      ...parentDocument,
      additionalAttachments: undefined,
      additionalContractors: undefined,
      additionalSigners: undefined,
      isCompleted: false,
      id: undefined,
      groupLeaderId: parentDocumentId,
      delegations: [],
      created: undefined,
      child: undefined,
      readingMarks: [],
      isRegistered: false,
    });
  }
}
