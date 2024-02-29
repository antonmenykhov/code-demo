import { PartialType } from '@nestjs/swagger';
import { CreateDelegationCommentDto } from './create-delegation-comment.dto';

export class UpdateDelegationCommentDto extends PartialType(CreateDelegationCommentDto) {}
