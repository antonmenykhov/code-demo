import { Injectable, OnModuleInit } from '@nestjs/common';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import { RoleUserDto } from 'src/roles/dto/role-user.dto';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import axios from 'axios';
import * as jwkToPem from 'jwk-to-pem';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenRepresentationFull } from './dto/access-token-representation-full.interface';
//global helper method :
const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();
// trick to keep dependencies into my webpack build
const nottrue = false;
if (nottrue) import('@keycloak/keycloak-admin-client');
@Injectable()
export class KeycloakService implements OnModuleInit {
  constructor(private jwtService: JwtService) {}

  private url = process.env.KEYCLOAK_URL;
  private realm = process.env.KEYCLOAK_REALM;
  private clientId = process.env.KEYCLOAK_CLIENT_ID;
  private clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
  private certs_url = process.env.KEYCLOAK_CERTS;
  private kcAdminClient: KeycloakAdminClient;
  private documentsClientId: string;
  public roles: RoleRepresentation[];
  public users: UserRepresentation[];
  public publicKey: string;
  async onModuleInit() {
    const KcAdminClient = (
      await dynamicImport('@keycloak/keycloak-admin-client')
    ).default as typeof KeycloakAdminClient;
    this.kcAdminClient = new KcAdminClient({
      baseUrl: this.url,
      realmName: this.realm,
    });
    await this.auth();
    this.documentsClientId = (
      await this.kcAdminClient.clients.find({
        realm: 'Fency',
        clientId: 'documents',
      })
    )[0].id;
    this.roles = await this.getRoles();
    this.users = await this.getUsers();
  }

  async auth() {
    await this.kcAdminClient.auth({
      grantType: 'client_credentials',
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
    setTimeout(() => this.auth(), 1000 * 60);
  }

  async mapRoles(users: UserRepresentation[]) {
    for await (const role of this.roles) {
      const usersInRolesIds = (
        await this.kcAdminClient.clients.findUsersWithRole({
          id: this.documentsClientId,
          roleName: role.name,
          realm: 'Fency',
        })
      ).map((user) => user.id);
      users.forEach((user) => {
        if (!user.clientRoles) user.clientRoles = { documents: [] };
        if (usersInRolesIds.includes(user.id)) {
          user.clientRoles.documents.push(role.name);
        }
      });
    }
    return users;
  }

  async getUsers() {
    const users = await this.kcAdminClient.users.find({
      realm: 'Fency',
      max: 5000,
    });
    this.users = await this.mapRoles(users);
    return this.users;
  }

  async getUser(id: string) {
    return (
      await this.mapRoles([
        await this.kcAdminClient.users.findOne({ realm: 'Fency', id }),
      ])
    )[0];
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.kcAdminClient.users.create({
      realm: 'Fency',
      email: createUserDto.email,
      lastName: createUserDto.name,
      firstName: createUserDto.position,
      emailVerified: true,
      username: createUserDto.phone,
      enabled: true,
      credentials: [
        {
          type: 'password',
          temporary: false,
          value: createUserDto.password,
          userLabel: 'My password',
        },
      ],
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.kcAdminClient.users.update(
      { id, realm: 'Fency' },
      {
        email: updateUserDto.email || undefined,
        lastName: updateUserDto.name || undefined,
        firstName: updateUserDto.position || undefined,
        username: updateUserDto.phone || undefined,
        credentials: updateUserDto.password
          ? [
              {
                type: 'password',
                temporary: false,
                value: updateUserDto.password,
                userLabel: 'My password',
              },
            ]
          : undefined,
      },
    );
  }

  async deleteUser(id: string) {
    return this.kcAdminClient.users.del({ id, realm: 'Fency' });
  }

  async getRoles() {
    const roles = await this.kcAdminClient.clients.listRoles({
      id: this.documentsClientId,
      realm: 'Fency',
    });
    this.roles = roles;
    return roles;
  }

  async addRoles(roleUserDto: RoleUserDto) {
    return this.kcAdminClient.users.addClientRoleMappings({
      clientUniqueId: this.documentsClientId,
      id: roleUserDto.userId,
      realm: 'Fency',
      roles: roleUserDto.roles,
    });
  }

  async deleteRoles(roleUserDto: RoleUserDto) {
    return this.kcAdminClient.users.delClientRoleMappings({
      clientUniqueId: this.documentsClientId,
      id: roleUserDto.userId,
      realm: 'Fency',
      roles: roleUserDto.roles,
    });
  }

  async getPublicKeyFromKeycloak(token: string) {
    const kid = JSON.parse(
      Buffer.from(token.split('.')[0], 'base64').toString(),
    ).kid;
    const cert = (await axios.get(this.certs_url)).data.keys.find(
      (cert) => cert.kid === kid,
    );
    this.publicKey = jwkToPem(cert);
    return this.publicKey;
  }

  async getPublicKey(token: string) {
    if (this.publicKey) return this.publicKey;
    return await this.getPublicKeyFromKeycloak(token);
  }

  async verifyAndDecodeToken(token: string) {
    return this.jwtService.verify<AccessTokenRepresentationFull>(token, {
      publicKey: await this.getPublicKey(token),
    });
  }
}
