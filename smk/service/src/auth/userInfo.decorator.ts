import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfoDto } from './dto/user-info.dto';
export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserInfoDto;
  },
);
