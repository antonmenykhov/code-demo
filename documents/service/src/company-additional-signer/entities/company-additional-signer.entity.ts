import { Attachment } from 'src/attachment/entities/attachment.entity';
import { BaseEntity } from 'src/classes/base.entity';
import { Company } from 'src/company/entities/company.entity';
import { DocumentItem } from 'src/document/entities/document.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class CompanyAdditionalSigner extends BaseEntity {
  @Column()
  name: string;
  @ManyToOne(
    () => Attachment,
    (attachment) => attachment.companyAdditionalSignerStamps,
  )
  stamp: Attachment;
  @Column()
  stampId: number;
  @ManyToOne(() => Company, (company) => company.additionalSigners)
  company: Company;
  @Column()
  companyId: number;
  @ManyToMany(() => DocumentItem, (document) => document.additionalSigners)
  documents: DocumentItem[];
}
