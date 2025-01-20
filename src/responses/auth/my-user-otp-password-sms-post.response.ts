import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserOtpPasswordSmsPostResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMyUserOtpPasswordSmsPostResponse = z.infer<typeof ZitadelMyUserOtpPasswordSmsPostResponseSchema>
