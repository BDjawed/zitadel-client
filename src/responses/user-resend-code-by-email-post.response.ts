import type { Details } from './common'

export interface ZitadelUserResendVerifyCodeByEmailPostResponse {
  details: Details
  verificationCode?: string
}
