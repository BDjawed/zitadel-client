import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelAppApiDeleteResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelAppApiDeleteResponse = z.infer<typeof ZitadelAppApiDeleteResponseSchema>
