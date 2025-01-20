import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserOtpPasswordCheckPostResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMyUserOtpPasswordCheckPostResponse = z.infer<typeof ZitadelMyUserOtpPasswordCheckPostResponseSchema>
