import { BaseEntity } from 'src/classes/base.entity';
import { CompanyAdditionalSigner } from 'src/company-additional-signer/entities/company-additional-signer.entity';
import { Company } from 'src/company/entities/company.entity';
import { DocumentItem } from 'src/document/entities/document.entity';
import { UserSign } from 'src/user-sign/entities/user-sign.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Attachment extends BaseEntity {
  @Column()
  filePath: string;
  @Column({ default: 'file' })
  fileName: string;
  @OneToMany(() => Company, (company) => company.stamp)
  companyStamps: Company[];
  @OneToMany(() => Company, (company) => company.header)
  companyHeaders: Company[];
  @OneToMany(() => DocumentItem, (doc) => doc.attachment)
  documentAttachments: DocumentItem[];
  @OneToMany(() => DocumentItem, (doc) => doc.reciept)
  documentReciepts: DocumentItem[];
  @OneToMany(() => UserSign, (sign) => sign.attachment)
  userSigns: UserSign[];
  @ManyToMany(() => DocumentItem, (di) => di.additionalAttachments)
  documentAdditionalAttachments: DocumentItem[];
  @OneToMany(() => CompanyAdditionalSigner, (signer) => signer.stamp)
  companyAdditionalSignerStamps: CompanyAdditionalSigner[];
}
