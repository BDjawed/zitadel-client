import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserOtpPasswordSmsDeleteResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMyUserOtpPasswordSmsDeleteResponse = z.infer<typeof ZitadelMyUserOtpPasswordSmsDeleteResponseSchema>
