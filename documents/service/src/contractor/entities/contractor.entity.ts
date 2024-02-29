import { BaseEntity } from 'src/classes/base.entity';
import { ContractorDirector } from 'src/contractor-director/entities/contractor-director.entity';
import { DocumentItem } from 'src/document/entities/document.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Contractor extends BaseEntity {
  @Column()
  name: string;
  @Column({ nullable: true })
  shortName: string;
  @Column()
  reqisits: string;
  @Column()
  email: string;
  @Column()
  address: string;
  @OneToMany(() => DocumentItem, (document) => document.contractor)
  documents: DocumentItem[];
  @OneToMany(
    () => ContractorDirector,
    (contractorDirector) => contractorDirector.contractor,
  )
  directors: ContractorDirector[];
}
