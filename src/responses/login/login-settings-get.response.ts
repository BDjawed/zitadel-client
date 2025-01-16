import { z } from 'zod'
import { ZitadelPasswordlessType } from '../..'
import { DetailsSchema } from '../common'

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

export enum IdpType {
  UNSPECIFIED = 'IDP_TYPE_UNSPECIFIED',
  OIDC = 'IDP_TYPE_OIDC',
  JWT = 'IDP_TYPE_JWT',
}

export const IdpsSchema = z.object({
  idpId: z.string().min(1, 'IDP ID is required'),
  idpName: z.string().min(1, 'IDP name is required'),
  idpType: z.nativeEnum(IdpType),
})

export type Idps = z.infer<typeof IdpsSchema>

export const ZitadelLoginSettingsGetResponseSchema = z.object({
  policy: z.object({
    details: DetailsSchema,
    allowUsernamePassword: z.boolean(),
    allowRegister: z.boolean(),
    allowExternalIdp: z.boolean(),
    forceMfa: z.boolean(),
    passwordlessType: z.nativeEnum(ZitadelPasswordlessType),
    isDefault: z.boolean(),
    hidePasswordReset: z.boolean(),
    ignoreUnknownUsernames: z.boolean(),
    defaultRedirectUri: z.string().min(1, 'Default redirect URI is required'),
    passwordCheckLifetime: z.string().min(1, 'Password check lifetime is required'),
    externalLoginCheckLifetime: z.string().min(1, 'External login check lifetime is required'),
    mfaInitSkipLifetime: z.string().min(1, 'MFA init skip lifetime is required'),
    secondFactorCheckLifetime: z.string().min(1, 'Second factor check lifetime is required'),
    multiFactorCheckLifetime: z.string().min(1, 'Multi factor check lifetime is required'),
    secondFactors: z.array(z.nativeEnum(SecondFactors)),
    multiFactors: z.array(z.nativeEnum(MultiFactors)),
    idps: z.array(IdpsSchema),
    allowDomainDiscovery: z.boolean(),
    disableLoginWithEmail: z.boolean(),
    disableLoginWithPhone: z.boolean(),
    forceMfaLocalOnly: z.boolean(),
  }),
  isDefault: z.boolean(),
})

export type ZitadelLoginSettingsGetResponse = z.infer<typeof ZitadelLoginSettingsGetResponseSchema>
