import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as jwkToPem from 'jwk-to-pem';
import { AccessTokenRepresentationFull } from './dto/access-token-representation-full.interface';

const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();
const nottrue = false;
if (nottrue) import('@keycloak/keycloak-admin-client');

@Injectable()
export class KeycloakService implements OnModuleInit {
  constructor(private jwtService: JwtService) {}
  private url = process.env.KEYCLOAK_URL;
  private realm = process.env.KEYCLOAK_REALM;
  private clientId = process.env.KEYCLOAK_CLIENT_ID;
  private clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
  public workRealm = process.env.KEYCLOAK_WORK_REALM;
  private certsUrl = process.env.KEYCLOAK_CERTS;
  public roleMapperAccessAttribute = 'roleMapperAccess';
  public keycloakRealmClientId = process.env.KEYCLOAK_REALM_CLIENT_ID;

  public kcAdminClient: KeycloakAdminClient;
  private publicKey: string;

  private async authService() {
    await this.kcAdminClient.auth({
      grantType: 'client_credentials',
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
    setTimeout(() => this.authService(), 1000 * 60);
  }

  private async initKcAdminClient() {
    const KcAdminClient = (
      await dynamicImport('@keycloak/keycloak-admin-client')
    ).default as typeof KeycloakAdminClient;
    this.kcAdminClient = new KcAdminClient({
      baseUrl: this.url,
      realmName: this.realm,
    });
    await this.authService();
  }

  async onModuleInit() {
    await this.initKcAdminClient();
  }

  private async getPublicKeyFromKeycloak(token: string) {
    const kid = JSON.parse(
      Buffer.from(token.split('.')[0], 'base64').toString(),
    ).kid;
    const cert = (await axios.get(this.certsUrl)).data.keys.find(
      (cert) => cert.kid === kid,
    );
    this.publicKey = jwkToPem(cert);
    return this.publicKey;
  }

  private async getPublicKey(token: string) {
    if (this.publicKey) return this.publicKey;
    return await this.getPublicKeyFromKeycloak(token);
  }

  async verifyAndDecodeToken(token: string) {
    return this.jwtService.verify<AccessTokenRepresentationFull>(token, {
      publicKey: await this.getPublicKey(token),
    });
  }

  async getUserProfile(id: string) {
    return this.kcAdminClient.users.findOne({
      id,
      realm: this.workRealm,
    });
  }

  async awailibleServiceOfUser(id: string): Promise<string[]> {
    return (
      (await this.getUserProfile(id))?.attributes?.[
        this.roleMapperAccessAttribute
      ] || []
    );
  }
}
