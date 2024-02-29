import { BaseEntity } from 'src/classes/base.entity';
import { ContractorDirector } from 'src/contractor-director/entities/contractor-director.entity';
import { Contractor } from 'src/contractor/entities/contractor.entity';
import { DocumentItem } from 'src/document/entities/document.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class DocumentAdditionalContractor extends BaseEntity {
  @ManyToOne(() => Contractor)
  contractor: Contractor;
  @Column()
  contractorId: number;
  @ManyToOne(() => ContractorDirector)
  contractorDirector: ContractorDirector;
  @Column()
  contractorDirectorId: number;
  @ManyToOne(
    () => DocumentItem,
    (documentItem) => documentItem.additionalContractors,
  )
  document: DocumentItem;
  @Column()
  documentId: number;
}
