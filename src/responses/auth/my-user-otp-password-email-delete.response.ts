import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserOtpPasswordEmailDeleteResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMyUserOtpPasswordEmailDeleteResponse = z.infer<typeof ZitadelMyUserOtpPasswordEmailDeleteResponseSchema>
