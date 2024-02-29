import { Attachment } from 'src/attachment/entities/attachment.entity';
import { BaseEntity } from 'src/classes/base.entity';
import { CompanyAdditionalSigner } from 'src/company-additional-signer/entities/company-additional-signer.entity';
import { Company } from 'src/company/entities/company.entity';
import { ContractorDirector } from 'src/contractor-director/entities/contractor-director.entity';
import { Contractor } from 'src/contractor/entities/contractor.entity';
import { Delegation } from 'src/delegation/entities/delegation.entity';
import { DocumentAdditionalContractor } from 'src/document-additional-contractor/entities/document-additional-contractor.entity';
import { DocumentReadingMark } from 'src/document-reading-mark/entities/document-reading-mark.entity';
import { Emailer } from 'src/emailer/entities/emailer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class DocumentItem extends BaseEntity {
  @Column()
  name: string;
  @Column({ default: 0 })
  regnumber: number;
  @Column()
  content: string;
  @CreateDateColumn()
  created: string;
  @Column()
  isIncoming: boolean;
  @ManyToOne(() => Contractor, (contractor) => contractor.documents)
  contractor: Contractor;
  @Column({ nullable: true })
  contractorId: number;
  @ManyToOne(() => ContractorDirector)
  contractorDirector: ContractorDirector;
  @Column({ nullable: true })
  contractorDirectorId: number;
  @ManyToOne(() => Attachment, (attachment) => attachment.documentAttachments)
  attachment: Attachment;
  @Column({ nullable: true })
  attachmentId: number;
  @ManyToOne(() => Company, (company) => company.documents)
  company: Company;
  @Column({ nullable: true })
  companyId: number;
  @OneToMany(() => Delegation, (delegation) => delegation.document)
  delegations: Delegation[];
  @OneToOne(() => DocumentItem, (docuemnt) => docuemnt.child)
  @JoinColumn()
  parent: DocumentItem;
  @Column({ nullable: true })
  parentId: number;
  @OneToOne(() => DocumentItem, (document) => document.parent)
  child: DocumentItem;
  @Column({ default: false })
  isStamped: boolean;
  @Column({ default: false })
  isCompleted: boolean;
  @Column({ default: false })
  isRegistered: boolean;
  @Column({ default: false })
  isExternalRegistered: boolean;
  @Column({ nullable: true })
  externalRegnumber: string;
  @Column({ nullable: true, type: 'timestamp' })
  externalCreated: string;
  @Column({ nullable: true })
  recieptId: number;
  @ManyToOne(() => Attachment, (attachment) => attachment.documentReciepts)
  reciept: Attachment;
  @OneToMany(() => DocumentReadingMark, (mark) => mark.document)
  readingMarks: DocumentReadingMark[];
  @OneToMany(() => DocumentAdditionalContractor, (ac) => ac.document)
  additionalContractors: DocumentAdditionalContractor[];
  @ManyToMany(
    () => Attachment,
    (attachemnt) => attachemnt.documentAdditionalAttachments,
  )
  @JoinTable()
  additionalAttachments: Attachment[];
  @Column({ nullable: true })
  workerId: string | null;
  @Column({ default: true })
  withWorkerMark: boolean;
  @Column({ default: false })
  companyEmailToWorkerMark: boolean;
  @ManyToMany(() => CompanyAdditionalSigner, (signer) => signer.documents)
  @JoinTable()
  additionalSigners: CompanyAdditionalSigner[];
  @OneToMany(() => Emailer, (emailer) => emailer.document)
  emailers: Emailer[];
  @Column({ nullable: true })
  groupLeaderId: number | null;
}
