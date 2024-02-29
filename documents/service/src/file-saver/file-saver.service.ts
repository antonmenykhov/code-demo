import { Injectable } from '@nestjs/common';
import { cp, mkdir } from 'fs/promises';
import { DocumentItem } from 'src/document/entities/document.entity';

@Injectable()
export class FileSaverService {
  private storagePath = process.env.STORAGE_PATH;

  getInOutDirName(isIncoming: boolean) {
    return isIncoming ? 'ВХОДЯЩИЕ' : 'ИСХОДЯЩИЕ';
  }

  getYear(dateString: string) {
    return new Date(dateString).getFullYear();
  }

  getDateFormat(dateString: string) {
    const date = new Date(dateString);
    return `${date.getDate()}.${
      date.getMonth() + 1 > 9
        ? date.getMonth() + 1
        : '0' + (date.getMonth() + 1)
    }.${date.getFullYear()}`;
  }

  getDocumentName(documentItem: DocumentItem) {
    return `№ ${documentItem.regnumber} от ${this.getDateFormat(
      documentItem.created,
    )} (${
      documentItem.contractor?.shortName || documentItem.contractor?.name || ''
    } ${documentItem.name})`.replaceAll('"', "'");
  }

  async orginizeFile(documentItem: DocumentItem) {
    if (!documentItem.attachment)
      return console.log(documentItem.id, 'Нет файла для переноса');
    if (
      (!documentItem.isRegistered || documentItem.regnumber === 0) &&
      documentItem.groupLeaderId === null
    )
      return console.log(documentItem.id, 'Файл не зарегистрирован');
    const path = `${this.storagePath}/${
      documentItem.company.pathToDir
    }/${this.getInOutDirName(documentItem.isIncoming)}/${this.getYear(
      documentItem.created,
    )}`.replaceAll('"', "'");
    await mkdir(path, { recursive: true });
    await cp(
      documentItem.attachment.filePath,
      `${path}/${this.getDocumentName(documentItem)}.pdf`,
      { force: true },
    );
  }
}
