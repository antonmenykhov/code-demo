import { Injectable } from '@nestjs/common';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { DocumentReadingMark } from './entities/document-reading-mark.entity';
import { CreateDocumentReadingMarkDto } from './dto/create-document-reading-mark.dto';
import { UpdateDocumentReadingMarkDto } from './dto/update-document-reading-mark.dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class DocumentReadingMarkService extends DefaultCrud<
  DocumentReadingMark,
  CreateDocumentReadingMarkDto,
  UpdateDocumentReadingMarkDto
> {
  constructor(@InjectDataSource() private dataSourse: DataSource) {
    super(DocumentReadingMark, dataSourse);
  }

  async createMark(createDocumentReadingMarkDto: CreateDocumentReadingMarkDto) {
    const existMark = await this.repository.findOne({
      where: {
        documentId: createDocumentReadingMarkDto.documentId,
        userId: createDocumentReadingMarkDto.userId,
        withoutAnswer: createDocumentReadingMarkDto.withoutAnswer,
      },
    });
    if (existMark) return undefined;
    return await this.create(createDocumentReadingMarkDto);
  }
}
