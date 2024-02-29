import { PartialType } from '@nestjs/swagger';
import { CreateRequestCommentDto } from './create-request-comment.dto';

export class UpdateRequestCommentDto extends PartialType(CreateRequestCommentDto) {}
