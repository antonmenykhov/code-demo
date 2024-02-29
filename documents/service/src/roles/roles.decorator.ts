import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

export const Roles = (roles: string[], clientName = 'documents') =>
  applyDecorators(
    UseGuards(RolesGuard),
    SetMetadata('roles', roles),
    SetMetadata('service', clientName),
  );
