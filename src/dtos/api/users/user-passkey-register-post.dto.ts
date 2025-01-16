import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '..'

export const ZitadelUserPasskeyRegisterPostPathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserPasskeyRegisterPostPathDto = z.infer<typeof ZitadelUserPasskeyRegisterPostPathSchema>

export const CodeSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  code: z.string().min(1, 'Code is required'),
})

export type Code = z.infer<typeof CodeSchema>

export enum AuthenticatorType {
  UNSPECIFIED = 'PASSKEY_AUTHENTICATOR_UNSPECIFIED',
  PLATFORM = 'PASSKEY_AUTHENTICATOR_PLATFORM',
  CROSS_PLATFORM = 'PASSKEY_AUTHENTICATOR_CROSS_PLATFORM',
}

export const ZitadelUserPasskeyRegisterPostSchema = z.object({
  code: CodeSchema,
  authenticator: z.nativeEnum(AuthenticatorType),
  domain: z.string().min(1, 'Domain is required'),
})

export type ZitadelUserPasskeyRegisterPostDto = z.infer<typeof ZitadelUserPasskeyRegisterPostSchema>
