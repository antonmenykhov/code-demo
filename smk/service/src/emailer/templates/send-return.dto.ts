import { IsArray } from 'class-validator';

export class SendReturnDto {
  @IsArray()
  groups: number[];
}
