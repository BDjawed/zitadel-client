import { z } from 'zod'
import { DetailsSchema } from './common'

export const ZitadelUserResendVerifyCodeByPhonePostResponseSchema = z.object({
  details: DetailsSchema,
  verificationCode: z.string().optional(),
})

export type ZitadelUserResendVerifyCodeByPhonePostResponse = z.infer<typeof ZitadelUserResendVerifyCodeByPhonePostResponseSchema>
