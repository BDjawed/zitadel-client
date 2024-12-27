import type { ZitadelUserByIdGetPathDto } from '.'

export interface ZitadelUserResendVerifyCodeByPhonePathDto extends ZitadelUserByIdGetPathDto {}

export interface ZitadelUserResendVerifyCodeByPhonePostDto {
  sendCode?: object
  returnCode?: object
}
