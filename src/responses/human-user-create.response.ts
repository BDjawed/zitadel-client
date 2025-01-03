import type { Details } from './common'

export interface ZitadelHumanUserCreateResponse {
  userId?: string
  details: Details
  emailCode?: string
  phoneCode?: string
}
