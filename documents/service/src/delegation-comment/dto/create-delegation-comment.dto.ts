import { IsNumber, IsString } from 'class-validator';

export class CreateDelegationCommentDto {
  @IsString()
  comment: string;
  @IsString()
  fromId: string;
  @IsNumber()
  delegationId: number;
}
