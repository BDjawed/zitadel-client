import type { ZitadelUserByIdGetPathDto } from '.'

export interface ZitadelUserResendVerifyCodeByEmailPathDto extends ZitadelUserByIdGetPathDto {}

export interface ZitadelUserResendVerifyCodeByEmailPostDto {
  sendCode?: SendCode
  returnCode?: object
}

interface SendCode {
  urlTemplate: string
}
