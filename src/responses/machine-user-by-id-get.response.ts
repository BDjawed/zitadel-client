import type { Details } from './common'

export interface ZitadelMachineUserByIdGetResponse {
  key: Key
}

export interface Key {
  id: string
  details: Details
  type: ZitadelMachineUserKeyType
  expirationDate: string
}

export enum ZitadelMachineUserKeyType {
  UNSPECIFIED = 'KEY_TYPE_UNSPECIFIED',
  JSON = 'KEY_TYPE_JSON',
}
