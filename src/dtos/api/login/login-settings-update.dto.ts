import { z } from 'zod'

export enum ZitadelPasswordlessType {
  ALLOWED = 'PASSWORDLESS_TYPE_ALLOWED',
  NOT_ALLOWED = 'PASSWORDLESS_TYPE_NOT_ALLOWED',
}

export const ZitadelLoginSettingsUpdateSchema = z.object({
  passwordlessType: z.nativeEnum(ZitadelPasswordlessType),
  forceMfa: z.boolean(),
  forceMfaLocalOnly: z.boolean(),
  passwordCheckLifetime: z.string(),
  externalLoginCheckLifetime: z.string(),
  mfaInitSkipLifetime: z.string(),
  secondFactorCheckLifetime: z.string(),
  multiFactorCheckLifetime: z.string(),
  allowUsernamePassword: z.boolean(),
  allowRegister: z.boolean(),
  allowExternalIdp: z.boolean(),
  hidePasswordReset: z.boolean(),
  allowDomainDiscovery: z.boolean(),
  ignoreUnknownUsernames: z.boolean(),
  disableLoginWithEmail: z.boolean(),
  disableLoginWithPhone: z.boolean(),
  defaultRedirectUri: z.string(),
})

export type ZitadelLoginSettingsUpdateDto = z.infer<typeof ZitadelLoginSettingsUpdateSchema>
