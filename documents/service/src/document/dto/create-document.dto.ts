import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Attachment } from 'src/attachment/entities/attachment.entity';
import { CompanyAdditionalSigner } from 'src/company-additional-signer/entities/company-additional-signer.entity';
import { CreateDocumentAdditionalContractorDto } from 'src/document-additional-contractor/dto/create-document-additional-contractor.dto';

export class CreateDocumentDto {
  @IsString()
  name: string;
  @IsNumber()
  regnumber: number;
  @IsString()
  content: string;
  @IsBoolean()
  isIncoming: boolean;
  @IsNumber()
  contractorId: number | null;
  @IsNumber()
  attachmentId: number;
  @IsNumber()
  companyId: number | null;
  isStamped: boolean;
  isCompleted: boolean;
  isRegistered: boolean;
  parentId: null | number;
  isExternalRegistered: boolean;
  @IsOptional()
  @IsString()
  externalRegnumber?: string;
  @IsOptional()
  @IsString()
  externalCreated?: string;
  @IsOptional()
  @IsNumber()
  recieptId?: number;
  @IsOptional()
  @IsArray()
  additionalContractors?: CreateDocumentAdditionalContractorDto[];
  @IsOptional()
  @IsArray()
  additionalAttachments?: Attachment[];
  @IsOptional()
  @IsString()
  workerId?: string | null;
  @IsOptional()
  @IsBoolean()
  withWorkerMark?: boolean;
  @IsOptional()
  @IsBoolean()
  companyEmailToWorkerMark?: boolean;
  @IsOptional()
  @IsArray()
  additionalSigners?: CompanyAdditionalSigner[];
}
