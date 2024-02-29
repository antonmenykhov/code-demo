import { Injectable } from '@nestjs/common';
import { OutDocumentFormDto } from './dto/out-document-form.dto';
import axios from 'axios';
import { AttachmentTransformerService } from 'src/attachment-transformer/attachment-transformer.service';
import { readFile } from 'fs/promises';
import {
  AttachmentService,
  MulterOmited,
} from 'src/attachment/attachment.service';
import { createReadStream } from 'node:fs';
import { PdfWorkerService } from 'src/pdf-worker/pdf-worker.service';

@Injectable()
export class HtmlRenderService {
  constructor(
    private attachmentTransformerService: AttachmentTransformerService,
    private attachmentService: AttachmentService,
    private pdfWorkerService: PdfWorkerService,
  ) {}
  private port = process.env.PORT;
  async createOutDocumentAttachment(
    outDocumentFormDto: OutDocumentFormDto,
    token: string,
  ) {
    if (outDocumentFormDto.withStamp) {
      const stamp = await this.getStamp(outDocumentFormDto, token);
      if (!outDocumentFormDto.answer_content.includes('((Печать))'))
        outDocumentFormDto.answer_content += '((Печать))';
      outDocumentFormDto.answer_content = outDocumentFormDto.answer_content
        .split('((Печать))')
        .join(stamp);
    }
    const outDocumentHtml = await this.getOutDocument(
      outDocumentFormDto,
      token,
    );
    const workerMark = outDocumentFormDto.with_worker
      ? await this.getWorkerMark(outDocumentFormDto, token)
      : undefined;
    const outDocumentPdf =
      await this.attachmentTransformerService.transformHtmlToPdf(
        outDocumentHtml,
        workerMark,
      );
    if (outDocumentFormDto.additional_attachments.length === 0)
      return await this.saveFileAndCreateAttachment(outDocumentPdf);
    const filesForMerging: ArrayBuffer[] = [outDocumentPdf];
    for await (const attachment of outDocumentFormDto.additional_attachments) {
      filesForMerging.push(await readFile(attachment.filePath));
    }
    return this.saveFileAndCreateAttachment(
      Buffer.from(
        await this.pdfWorkerService.mergePDFDocuments(filesForMerging),
      ),
    );
  }

  private async getStamp(
    outDocumentFormDto: OutDocumentFormDto,
    token: string,
  ) {
    let stampText = '';
    stampText += (
      await axios.post<string>(
        `http://localhost:${this.port}/company-stamp`,
        {
          company_manager: outDocumentFormDto.company_manager
            .split('\n')
            .join(' <br> '),
          signSrc: `http://localhost:${this.port}/attachment/${outDocumentFormDto.company_stampId}?token=Bearer ${token}`,
          withStamp: outDocumentFormDto.withStamp,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
    ).data;

    for await (const signer of outDocumentFormDto.additionalSigners) {
      stampText += (
        await axios.post<string>(
          `http://localhost:${this.port}/company-stamp`,
          {
            company_manager: signer.name.split('\n').join(' <br> '),
            signSrc: `http://localhost:${this.port}/attachment/${signer.stampId}?token=Bearer ${token}`,
            withStamp: outDocumentFormDto.withStamp,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        )
      ).data;
    }
    return stampText;
  }

  private async getOutDocument(
    outDocumentFormDto: OutDocumentFormDto,
    token: string,
  ) {
    return (
      await axios.post<string>(
        `http://localhost:${this.port}/out-document`,
        outDocumentFormDto,
        { headers: { Authorization: `Bearer ${token}` } },
      )
    ).data;
  }

  private async getWorkerMark(
    outDocumentFormDto: OutDocumentFormDto,
    token: string,
  ) {
    return (
      await axios.post<string>(
        `http://localhost:${this.port}/worker-mark`,
        outDocumentFormDto,
        { headers: { Authorization: `Bearer ${token}` } },
      )
    ).data;
  }

  private async saveFileAndCreateAttachment(file: Buffer) {
    const multerFile: MulterOmited = {
      buffer: file,
      destination: '',
      fieldname: 'file',
      mimetype: 'application/pdf',
      originalname: 'Исходящий.pdf',
      size: 1,
      filename: 'Исходящий.pdf',
    };
    const attachment =
      await this.attachmentService.saveFileAndCreate(multerFile);

    return attachment;
  }
}
