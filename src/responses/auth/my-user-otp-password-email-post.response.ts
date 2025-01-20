import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserOtpPasswordEmailPostResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMyUserOtpPasswordEmailPostResponse = z.infer<typeof ZitadelMyUserOtpPasswordEmailPostResponseSchema>
