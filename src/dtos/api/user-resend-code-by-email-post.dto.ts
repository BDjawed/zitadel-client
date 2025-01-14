import { z } from 'zod'
import { SendCodeSchema, ZitadelUserByIdGetPathSchema } from '.'

export const ZitadelUserResendVerifyCodeByEmailPathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserResendVerifyCodeByEmailPathDto = z.infer<typeof ZitadelUserResendVerifyCodeByEmailPathSchema>

export const ZitadelUserResendVerifyCodeByEmailPostSchema = z.object({
  sendCode: SendCodeSchema.optional(),
  returnCode: z.object({}).optional(),
})

export type ZitadelUserResendVerifyCodeByEmailPostDto = z.infer<typeof ZitadelUserResendVerifyCodeByEmailPostSchema>
