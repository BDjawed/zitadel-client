import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelUserResendVerifyCodeByEmailPostResponseSchema = z.object({
  details: DetailsSchema,
  verificationCode: z.string().optional(),
})

export type ZitadelUserResendVerifyCodeByEmailPostResponse = z.infer<typeof ZitadelUserResendVerifyCodeByEmailPostResponseSchema>
