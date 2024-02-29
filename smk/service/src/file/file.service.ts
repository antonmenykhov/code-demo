import { Injectable } from '@nestjs/common';
import { writeFile, mkdir, rm } from 'fs/promises';
import { DatabaseService } from 'src/database/database.service';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FileService {
  constructor(private databaseService: DatabaseService) {}
  private repository = this.databaseService.connection.getRepository(File);
  private sharePath = process.env.STORAGE;
  async uploadFile(file: Express.Multer.File, createFileDto: CreateFileDto) {
    const filePath = `/upload/${new Date().getTime()}/`;
    await this.saveToFolder(
      file.buffer,
      `${this.sharePath}${filePath}`,
      createFileDto.fileName,
    );
    return this.repository.save({
      path: filePath + createFileDto.fileName,
      actionId: +createFileDto.actionId,
      fileName: createFileDto.fileName,
    });
  }

  async remove(id: number) {
    const file = await this.repository.findOne({ where: { id } });
    await this.removeFile(file.path);
    return this.repository.delete(id);
  }

  async saveToFolder(buffer: Buffer, path: string, name: string) {
    await mkdir(path, { recursive: true });
    await writeFile(path + name, buffer);
    return path;
  }

  async removeFile(path: string) {
    await rm(`${this.sharePath}${path}`);
  }
}
