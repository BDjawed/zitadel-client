import type { ZitadelUserByIdGetPathDto } from '.'

export interface ZitadelUserPasskeyRegisterPostPathDto extends ZitadelUserByIdGetPathDto {}

export interface ZitadelUserPasskeyRegisterPostDto {
  code: Code
  authenticator: AuthenticatorType
  domain: string
}

interface Code {
  id: string
  code: string
}

export enum AuthenticatorType {
  UNSPECIFIED = 'PASSKEY_AUTHENTICATOR_UNSPECIFIED',
  PLATFORM = 'PASSKEY_AUTHENTICATOR_PLATFORM',
  CROSS_PLATFORM = 'PASSKEY_AUTHENTICATOR_CROSS_PLATFORM',
}
