import type { ZitadelUserByIdGetPathDto } from '.'

export interface ZitadelUserPasskeyLinkRegistrationPostPathDto extends ZitadelUserByIdGetPathDto {}

export interface ZitadelUserPasskeyLinkRegistrationPostDto {
  sendLink?: SendLink
  returnCode?: object
}

interface SendLink {
  urlTemplate: string
}
