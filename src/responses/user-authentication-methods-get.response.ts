import { z } from 'zod'
import { DetailsSchema } from './common'

export enum AuthMethodTypes {
  UNSPECIFIED = 'AUTHENTICATION_METHOD_TYPE_UNSPECIFIED',
  PASSWORD = 'AUTHENTICATION_METHOD_TYPE_PASSWORD',
  PASSKEY = 'AUTHENTICATION_METHOD_TYPE_PASSKEY',
  IDP = 'AUTHENTICATION_METHOD_TYPE_IDP',
  TOTP = 'AUTHENTICATION_METHOD_TYPE_TOTP',
  U2F = 'AUTHENTICATION_METHOD_TYPE_U2F',
  SMS = 'AUTHENTICATION_METHOD_TYPE_OTP_SMS',
  EMAIL = 'AUTHENTICATION_METHOD_TYPE_OTP_EMAIL',
}

export const ZitadelUserAuthenticationMethodsGetResponseSchema = z.object({
  details: DetailsSchema,
  authMethodTypes: z.array(z.nativeEnum(AuthMethodTypes)),
})

export type ZitadelUserAuthenticationMethodsGetResponse = z.infer<typeof ZitadelUserAuthenticationMethodsGetResponseSchema>
