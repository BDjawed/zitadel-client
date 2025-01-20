import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserU2fDeleteResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMyUserU2fDeleteResponse = z.infer<typeof ZitadelMyUserU2fDeleteResponseSchema>
