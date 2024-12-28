import type { ZitadelMachineUserKeyType } from '.'
import type { Details } from './common'

export interface ZitadelMachineUserKeysGetResponse {
  result: Result[]
}

export interface Result {
  id: string
  details: Details
  type: ZitadelMachineUserKeyType
  expirationDate: string
}
