import { DocumentItem } from '../entities/document.entity';

export class DocumentReport extends DocumentItem {
  dateTo: string;
  reportName: string;
  contractorName: string;
  companyName: string;
  createdFormated: string;
}
