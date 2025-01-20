import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserOtpPasswordPostResponseSchema = z.object({
  url: z.string(),
  secret: z.string(),
  details: DetailsSchema,
})

export type ZitadelMyUserOtpPasswordPostResponse = z.infer<typeof ZitadelMyUserOtpPasswordPostResponseSchema>
