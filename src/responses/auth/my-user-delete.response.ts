import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelDeleteMyUserResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMyUserDeleteResponse = z.infer<typeof ZitadelDeleteMyUserResponseSchema>
