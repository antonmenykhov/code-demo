import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Chokidar from 'chokidar';
import { readFile, rm } from 'fs/promises';
import {
  AttachmentService,
  MulterOmited,
} from 'src/attachment/attachment.service';
import { createReadStream } from 'fs';
import { DocumentService } from 'src/document/document.service';
import * as mime from 'mime';

@Injectable()
export class FileWatcherService implements OnModuleInit {
  constructor(
    private attachmentService: AttachmentService,
    private documentService: DocumentService,
  ) {}
  private directoryForWatching = process.env.WATCH_DIRECTORY;

  onModuleInit() {
    this.initWatcher();
  }

  initWatcher() {
    Chokidar.watch(this.directoryForWatching, {
      awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 200 },
    }).on('add', (path) => this.addDocumentItem(path));
  }

  getFileName(path: string) {
    const pathArr = path.split('\\');
    return pathArr[pathArr.length - 1];
  }

  async addDocumentItem(path: string) {
    const file: MulterOmited = {
      buffer: await readFile(path),
      destination: '',
      fieldname: 'file',
      mimetype: mime.lookup(path),
      originalname: this.getFileName(path),
      size: 1,
      filename: this.getFileName(path),
    };
    const attachment = await this.attachmentService.saveFileAndCreate(file);
    await this.documentService.create({
      attachmentId: attachment.id,
      companyId: null,
      contractorId: null,
      content: '',
      name: 'Необработанный документ',
      regnumber: 0,
      parentId: null,
      isCompleted: false,
      isRegistered: false,
      isIncoming: true,
      isStamped: false,
      isExternalRegistered: false,
    });
    await rm(path);
  }
}
