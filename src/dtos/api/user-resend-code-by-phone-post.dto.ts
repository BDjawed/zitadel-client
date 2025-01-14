import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '.'

export const ZitadelUserResendVerifyCodeByPhonePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserResendVerifyCodeByPhonePathDto = z.infer<typeof ZitadelUserResendVerifyCodeByPhonePathSchema>

export const ZitadelUserResendVerifyCodeByPhonePostSchema = z.object({
  sendCode: z.object({}).optional(),
  returnCode: z.object({}).optional(),
})

export type ZitadelUserResendVerifyCodeByPhonePostDto = z.infer<typeof ZitadelUserResendVerifyCodeByPhonePostSchema>
