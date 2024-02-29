import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { UserMapperInterceptor } from './userMapping.interceptor';

export const UserMapping = <T, P = any, K = keyof T, KP = keyof P>(
  fields: K[],
  nested?: KP | string,
) =>
  applyDecorators(
    UseInterceptors(UserMapperInterceptor<T, P>),
    SetMetadata('fields', fields),
    SetMetadata('nested', nested),
  );
