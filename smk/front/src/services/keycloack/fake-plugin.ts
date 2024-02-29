import type { KeycloakTokenParsed } from 'keycloak-js'

export type FakeKeycloakTokenParsed = KeycloakTokenParsed & {
  DepartmentId: string
  EmployeeId: string
  Grade: number
}

class FakeKeycloakClass {
  constructor(token: string) {
    this.token = token
    this.tokenParsed = this.decodeToken(token)
  }

  token: string
  tokenParsed: FakeKeycloakTokenParsed

  async init(args: any) {
    return true
  }

  updateToken(number: number) {
    return number
  }

  decodeToken(str: string): FakeKeycloakTokenParsed {
    str = str.split('.')[1]
    str = str.replace(/-/g, '+')
    str = str.replace(/_/g, '/')
    switch (str.length % 4) {
      case 0:
        break
      case 2:
        str += '=='
        break
      case 3:
        str += '='
        break
      default:
        throw 'Invalid token'
    }
    str = decodeURIComponent(escape(atob(str)))
    return JSON.parse(str) as FakeKeycloakTokenParsed
  }

  hasResourceRole(role: string, resource: string) {
    if (!this.tokenParsed.resource_access) {
      return false
    }
    const access = this.tokenParsed.resource_access[resource]
    return !!access && access.roles.indexOf(role) >= 0
  }
}

export { FakeKeycloakClass }
