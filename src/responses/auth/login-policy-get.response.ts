import { z } from 'zod'
import { IdpsSchema, MultiFactors, SecondFactors, ZitadelPasswordlessType } from '../..'
import { DetailsSchema } from '../common'

export const ZitadelLoginPolicyResponseSchema = z.object({
  policy: z.object({
    detail: DetailsSchema,
    allowUsernamePassword: z.boolean(),
    allowRegister: z.boolean(),
    allowExternalIdp: z.boolean(),
    forceMfa: z.boolean(),
    passwordlessType: z.nativeEnum(ZitadelPasswordlessType),
    isDefault: z.boolean(),
    hidePasswordReset: z.boolean(),
    ignoreUnknownUsernames: z.boolean(),
    defaultRedirectUri: z.string(),
    passwordCheckLifetime: z.string(),
    externalLoginCheckLifetime: z.string(),
    mfaInitSkipLifetime: z.string(),
    secondFactorCheckLifetime: z.string(),
    multiFactorCheckLifetime: z.string(),
    secondFactors: z.array(z.nativeEnum(SecondFactors)),
    multiFactors: z.array(z.nativeEnum(MultiFactors)),
    idps: z.array(IdpsSchema),
    allowDomainDiscovery: z.boolean(),
    disableLoginWithEmail: z.boolean(),
    disableLoginWithPhone: z.boolean(),
    forceMfaLocalOnly: z.boolean(),
  }),
})

export type ZitadelLoginPolicyGetResponse = z.infer<typeof ZitadelLoginPolicyResponseSchema>
