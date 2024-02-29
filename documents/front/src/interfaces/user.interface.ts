export interface User {
  id: string
  createdTimestamp: number
  username: string
  enabled: boolean
  totp: boolean
  emailVerified: boolean
  disableableCredentialTypes: string[]
  notBefore: number
  access: Record<string, boolean>
  attributes: Record<string, any>
  clientRoles: Record<string, any>
  email: string
  federationLink: string
  firstName: string
  groups: string[]
  lastName: string
  origin: string
  realmRoles: string[]
  self: string
  serviceAccountClientId: string
  password: string
}

export interface UserInfo {
  id: number
  email: string
  userId: string
}
