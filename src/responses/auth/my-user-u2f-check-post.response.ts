import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserU2fCheckPostResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMyUserU2fCheckPostResponse = z.infer<typeof ZitadelMyUserU2fCheckPostResponseSchema>
