import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
  StreamableFile,
} from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { Attachment } from './entities/attachment.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { mkdir, writeFile, rm, readFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { AttachmentTransformerService } from 'src/attachment-transformer/attachment-transformer.service';
import * as contentDisposition from 'content-disposition';

export type MulterOmited = Omit<
  Express.Multer.File,
  'stream' | 'path' | 'encoding'
>;

@Injectable()
export class AttachmentService
  extends DefaultCrud<Attachment, CreateAttachmentDto, UpdateAttachmentDto>
  implements OnModuleInit
{
  private libraryPath = process.env.LIBRARY_PATH || './libarary';
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private attachmentTransformerService: AttachmentTransformerService,
  ) {
    super(Attachment, dataSource);
  }

  async saveFileAndCreate(file: MulterOmited) {
    return this.create(await this.saveFile(file));
  }

  getName(originalName: string) {
    const nameArr = Buffer.from(originalName, 'latin1')
      .toString('utf8')
      .split('.');
    return nameArr[nameArr.length - 1] === 'png'
      ? nameArr.join('.')
      : nameArr.slice(0, nameArr.length - 1).join('.') + '.pdf';
  }

  private mimetimesAbailableForTransform = [
    'image/bmp',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/gif',
    'image/jpeg',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/rtf',
    'image/tiff',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  async getPdfFileBuffer(file: MulterOmited) {
    if (file.mimetype === 'text/plain')
      return this.attachmentTransformerService.transformHtmlToPdf(file.buffer);
    if (file.mimetype === 'application/pdf' || file.mimetype === 'image/png')
      return file.buffer;
    if (this.mimetimesAbailableForTransform.includes(file.mimetype))
      return await this.attachmentTransformerService.transformDocumentToPdf(
        file.buffer,
      );
    throw new HttpException(
      { message: 'Недопустимый формат файла' },
      HttpStatus.BAD_REQUEST,
    );
  }

  async saveFile(file: MulterOmited): Promise<CreateAttachmentDto> {
    const date = new Date();
    await mkdir(
      `${this.libraryPath}/${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`,
      { recursive: true },
    );
    const filePath = `${this.libraryPath}/${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()}/${randomUUID()}.pdf`;
    await writeFile(filePath, await this.getPdfFileBuffer(file));
    return {
      filePath,
      fileName: this.getName(file.originalname),
    };
  }

  async deleteFileAndRemove(fileId: number) {
    const file = await this.findOne(fileId);
    if (file) {
      await this.deleteFile(file.filePath);
      this.remove(fileId);
    }
  }

  async deleteFile(path: string) {
    return await rm(path);
  }

  async getFile(fileId: number) {
    const file = await this.findOne(fileId);
    if (file) {
      const streamFile = createReadStream(file.filePath);
      return new StreamableFile(streamFile, {
        type: file.fileName.includes('png') ? 'image/png' : 'application/pdf',
        disposition: contentDisposition(file.fileName),
      });
    }
    throw new HttpException(
      { message: 'Файл не найден' },
      HttpStatus.BAD_REQUEST,
    );
  }

  onModuleInit() {
    this.removeNotUsedAttachments();
  }

  async removeNotUsedAttachments() {
    const notUsed = await this.repository
      .createQueryBuilder('att')
      .withDeleted()
      .leftJoin('att.documentAttachments', 'docatt')
      .leftJoin('att.documentReciepts', 'docrec')
      .leftJoin('att.companyHeaders', 'comhead')
      .leftJoin('att.companyStamps', 'comst')
      .leftJoin('att.userSigns', 'uss')
      .leftJoin('att.documentAdditionalAttachments', 'daa')
      .leftJoin('att.companyAdditionalSignerStamps', 'cass')
      .having('COUNT(docatt) = 0')
      .andHaving('COUNT(comhead) = 0')
      .andHaving('COUNT(docrec) = 0')
      .andHaving('COUNT(comst) = 0')
      .andHaving('COUNT(uss) = 0')
      .andHaving('COUNT(daa) = 0')
      .andHaving('COUNT(cass) = 0')
      .addGroupBy('att.id')
      .getMany();

    for await (const file of notUsed) {
      await rm(file.filePath).catch(() => {});
    }
    await this.repository.remove(notUsed);
    setTimeout(
      () => {
        this.removeNotUsedAttachments();
      },
      1000 * 60 * 60 * 24,
    );
  }
}
