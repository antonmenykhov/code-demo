import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { ResponsibleService } from 'src/responsible/responsible.service';
import { ServiceStaffService } from 'src/service-staff/service-staff.service';
import { UserService } from 'src/user/user.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwkToPem = require('jwk-to-pem');

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private serviceStaffService: ServiceStaffService,
    private userService: UserService,
    private responsibleService: ResponsibleService,
  ) {}
  async getPublicKey(token: string) {
    if (!global.publicKey) {
      return await this.getPublicKeyFromKeycloak(token);
    } else {
      return global.publicKey;
    }
  }
  async getPublicKeyFromKeycloak(token: string) {
    const kid = JSON.parse(
      Buffer.from(token.split('.')[0], 'base64').toString(),
    ).kid;
    const certs = (await axios.get(process.env.CERT_URL)).data.keys;
    global.publicKey = await jwkToPem(certs.find((cert) => cert.kid === kid));
    return global.publicKey;
  }

  async getRoles(employeeId: string) {
    return await this.serviceStaffService.getRoles(employeeId);
  }

  async checkUserExist(employeeId: string) {
    return await this.userService.checkUserExist(employeeId);
  }

  async getDeputy(employeeId: string) {
    return await this.serviceStaffService.getDeputyId(employeeId);
  }

  async checkResponsible(employeeId: string) {
    return await this.responsibleService.checkExistResponsible(employeeId);
  }
}
