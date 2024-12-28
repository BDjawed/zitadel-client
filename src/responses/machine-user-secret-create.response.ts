import type { Details } from './common'

export interface ZitadelMachineUserSecretCreateResponse {
  clientId: string
  clientSecret: string
  details: Details
}
