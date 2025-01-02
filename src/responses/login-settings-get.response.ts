import type { ZitadelPasswordlessType } from '..'
import type { Details } from './common'

export interface ZitadelLoginSettingsGetResponse {
  policy: {
    details: Details
    allowUsernamePassword: boolean
    allowRegister: boolean
    allowExternalIdp: boolean
    forceMfa: boolean
    passwordlessType: ZitadelPasswordlessType
    isDefault: boolean
    hidePasswordReset: boolean
    ignoreUnknownUsernames: boolean
    defaultRedirectUri: string
    passwordCheckLifetime: string
    externalLoginCheckLifetime: string
    mfaInitSkipLifetime: string
    secondFactorCheckLifetime: string
    multiFactorCheckLifetime: string
    secondFactors: SecondFactors[]
    multiFactors: MultiFactors[]
    idps: Idps[]
  }
  isDefault: boolean
}

export enum SecondFactors {
  UNSPECIFIED = 'SECOND_FACTOR_TYPE_UNSPECIFIED',
  U2F = 'MULTI_FACTOR_TYPE_U2F_WITH_VERIFICATION',
}

export enum MultiFactors {
  UNSPECIFIED = 'MULTI_FACTOR_TYPE_UNSPECIFIED',
  OTP = 'MULTI_FACTOR_TYPE_OTP',
  U2F = 'MULTI_FACTOR_TYPE_U2F',
  EMAIL = 'MULTI_FACTOR_TYPE_OTP_EMAIL',
  SMS = 'MULTI_FACTOR_TYPE_OTP_SMS',
}

export interface Idps {
  allowDomainDiscovery: boolean
  disableLoginWithEmail: boolean
  disableLoginWithPhone: boolean
  forceMfaLocalOnly: boolean
}
