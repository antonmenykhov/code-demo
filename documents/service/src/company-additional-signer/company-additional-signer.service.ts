import { Injectable } from '@nestjs/common';
import { CreateCompanyAdditionalSignerDto } from './dto/create-company-additional-signer.dto';
import { UpdateCompanyAdditionalSignerDto } from './dto/update-company-additional-signer.dto';
import { DefaultCrud } from 'src/classes/default-crud.class';
import { CompanyAdditionalSigner } from './entities/company-additional-signer.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CompanyAdditionalSignerService extends DefaultCrud<
  CompanyAdditionalSigner,
  CreateCompanyAdditionalSignerDto,
  UpdateCompanyAdditionalSignerDto
> {
  constructor(@InjectDataSource() private datasource: DataSource) {
    super(CompanyAdditionalSigner, datasource);
  }
}
