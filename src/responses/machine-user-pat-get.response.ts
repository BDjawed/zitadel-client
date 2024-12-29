import type { Details } from './common'

export interface ZitadelMachineUserPatGetResponse {
  token: Token
}

export interface Token {
  id: string
  details: Details
  expirationDate: string
  scopes: string[]
}
