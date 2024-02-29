import { DefaultEntity } from 'src/common/default-entity.class';
import { Request } from 'src/request/entities/request.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class RequestStage extends DefaultEntity {
  @Column()
  name: string;
  @OneToMany(() => Request, (req) => req.stage)
  requests: Request[];
  @Column({ nullable: true })
  nextStageId: number | null;
  @Column({ nullable: true })
  previousStageId: number | null;
  @Column({ nullable: true })
  roleId: string | null;
  @Column()
  initialStage: boolean;
}
