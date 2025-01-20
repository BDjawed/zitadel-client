import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserOtpPasswordDeleteResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMyUserOtpPasswordDeleteResponse = z.infer<typeof ZitadelMyUserOtpPasswordDeleteResponseSchema>
