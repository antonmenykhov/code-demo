import { Injectable } from '@nestjs/common';
import { CreateDocumentAdditionalContractorDto } from './dto/create-document-additional-contractor.dto';
import { UpdateDocumentAdditionalContractorDto } from './dto/update-document-additional-contractor.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { DocumentAdditionalContractor } from './entities/document-additional-contractor.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class DocumentAdditionalContractorService extends DefaultCrud<
  DocumentAdditionalContractor,
  CreateDocumentAdditionalContractorDto,
  UpdateDocumentAdditionalContractorDto
> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(DocumentAdditionalContractor, dataSource);
  }

  async updateAllAdditionContractors(
    contractors: CreateDocumentAdditionalContractorDto[] = [],
    documentId: number,
  ) {
    await this.repository.delete({ documentId: documentId });
    if (contractors.length === 0) return;
    return await this.repository.save(contractors);
  }
}
