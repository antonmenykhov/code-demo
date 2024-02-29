import { Attachment } from 'src/attachment/entities/attachment.entity';
import { BaseEntity } from 'src/classes/base.entity';
import { CompanyAdditionalSigner } from 'src/company-additional-signer/entities/company-additional-signer.entity';
import { DocumentItem } from 'src/document/entities/document.entity';
import { Email } from 'src/email/entities/email.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Company extends BaseEntity {
  @Column()
  name: string;
  @Column()
  reqisits: string;
  @Column()
  email: string;
  @Column()
  manager: string;
  @Column()
  address: string;
  @OneToMany(() => DocumentItem, (document) => document.company)
  documents: DocumentItem[];
  @ManyToOne(() => Attachment, (attachment) => attachment.companyStamps)
  stamp: Attachment;
  @Column({ nullable: true })
  stampId: number;
  @ManyToOne(() => Attachment, (attachment) => attachment.companyHeaders)
  header: Attachment;
  @Column({ nullable: true })
  headerId: number;
  @Column({ default: '', nullable: true })
  pathToDir: string;
  @OneToMany(() => CompanyAdditionalSigner, (signer) => signer.company)
  additionalSigners: CompanyAdditionalSigner[];
  @ManyToOne(() => Email, (email) => email.companies)
  defaultEmail: Email;
  @Column({ nullable: true })
  defaultEmailId: number | null;
}
