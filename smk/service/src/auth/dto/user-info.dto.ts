export class UserInfoDto {
  'exp': number;
  'iat': number;
  'auth_time': number;
  'jti': string;
  'iss': string;
  'aud': string[];
  'sub': string;
  'typ': string;
  'azp': string;
  'nonce': string;
  'session_state': string;
  'acr': string;
  'allowed-origins': string[];
  'realm_access': {
    roles: string[];
  };
  'resource_access': { [key: string]: { roles: string[] } };
  roles: string[];
  'scope': string;
  'sid': string;
  'email_verified': boolean;
  'displayName': string;
  'name': string;
  'Grade': number;
  'preferred_username': string;
  'DepartmentId': string;
  'EmployeeId': string;
  'given_name': string;
  'family_name': string;
  'email': string;
}
