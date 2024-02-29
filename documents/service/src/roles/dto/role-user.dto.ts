import { RoleMappingPayload } from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class RoleUserDto {
  @IsString()
  readonly userId: string;

  @IsArray()
  readonly roles: RoleMappingPayload[];
}
