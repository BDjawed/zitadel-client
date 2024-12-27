import type { ZitadelUserByIdGetPathDto } from '.'

export interface ZitadelUserPhoneCreateDto {
  phone: string
  sendCode?: object
  returnCode?: object
  isVerified?: boolean
}

export interface ZitadelUserPhoneCreatePathDto extends ZitadelUserByIdGetPathDto {}
