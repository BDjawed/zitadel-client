import type { ZitadelUserByIdGetPathDto } from '.'

export interface ZitadelUserEmailCreatePathDto extends ZitadelUserByIdGetPathDto {}

export interface ZitadelUserEmailCreatePostDto {
  email: string
  sendCode?: SendCode
  returnCode?: object
  isVerified?: boolean
}

interface SendCode {
  urlTemplate: string
}
