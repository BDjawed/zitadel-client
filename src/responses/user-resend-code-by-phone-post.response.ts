import type { Details } from './common'

export interface ZitadelUserResendVerifyCodeByPhonePostResponse {
  details: Details
  verificationCode?: string
}
