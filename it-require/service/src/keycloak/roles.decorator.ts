import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { RolesGuard } from './roles.gurad';

export const Roles = (roles: string[], clientName = 'role-manager') =>
  applyDecorators(
    UseGuards(RolesGuard),
    SetMetadata('roles', roles),
    SetMetadata('service', clientName),
  );
