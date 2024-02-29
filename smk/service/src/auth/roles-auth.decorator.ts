import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

export const Roles = (roles?: string[] | undefined) =>
  applyDecorators(UseGuards(RolesGuard), SetMetadata('rolesData', { roles }));
