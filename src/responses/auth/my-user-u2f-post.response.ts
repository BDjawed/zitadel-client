import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserU2fPostResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMyUserU2fPostResponse = z.infer<typeof ZitadelMyUserU2fPostResponseSchema>
