import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '..'
import { SendCodeSchema } from '../common'

export const ZitadelUserResendVerifyCodeByEmailPathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserResendVerifyCodeByEmailPathDto = z.infer<typeof ZitadelUserResendVerifyCodeByEmailPathSchema>

export const ZitadelUserResendVerifyCodeByEmailPostSchema = z.object({
  sendCode: SendCodeSchema.optional(),
  returnCode: z.object({}).optional(),
})

export type ZitadelUserResendVerifyCodeByEmailPostDto = z.infer<typeof ZitadelUserResendVerifyCodeByEmailPostSchema>
