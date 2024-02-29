import { Attachment } from 'src/attachment/entities/attachment.entity';
import { CompanyAdditionalSigner } from 'src/company-additional-signer/entities/company-additional-signer.entity';

export class OutDocumentFormDto {
  header_url: string;
  regnumber: string;
  date: string;
  contractors: {
    contractor_director_staffName: string;
    contractor_name: string;
    contractor_address: string;
    contractor_director_fullName: string;
    contractor_email: string;
  }[];
  answer_header: string;
  answer_content: string;
  withRegnumber: boolean;
  company_manager: string;
  withStamp: boolean;
  company_stampId: string;
  additional_attachments: Attachment[];
  with_worker: boolean;
  worker_name: string;
  worker_phone: string;
  worker_email: string;
  additionalSigners: CompanyAdditionalSigner[];
}
