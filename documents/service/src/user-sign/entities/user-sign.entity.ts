import { Attachment } from 'src/attachment/entities/attachment.entity';
import { BaseEntity } from 'src/classes/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class UserSign extends BaseEntity {
  @Column()
  userId: string;
  @ManyToOne(() => Attachment, (attachment) => attachment.userSigns)
  attachment: Attachment;
  @Column()
  attachmentId: number;
}
