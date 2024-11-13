export interface ZitadelLoginSettingsUpdateDto {
  passwordlessType: ZitadelPasswordlessType
  forceMfa: boolean
  forceMfaLocalOnly: boolean
  passwordCheckLifetime: string
  externalLoginCheckLifetime: string
  mfaInitSkipLifetime: string
  secondFactorCheckLifetime: string
  multiFactorCheckLifetime: string
  allowUsernamePassword: boolean
  allowRegister: boolean
  allowExternalIdp: boolean
  hidePasswordReset: boolean
  allowDomainDiscovery: boolean
  ignoreUnknownUsernames: boolean
  disableLoginWithEmail: boolean
  disableLoginWithPhone: boolean
  defaultRedirectUri: string
}

export enum ZitadelPasswordlessType {
  ALLOWED = 'PASSWORDLESS_TYPE_ALLOWED',
  NOT_ALLOWED = 'PASSWORDLESS_TYPE_NOT_ALLOWED',
}
