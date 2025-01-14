import { z } from 'zod'
import { DetailsSchema } from './common'

export const ZitadelProjectCreateResponseSchema = z.object({
  id: z.string(),
  details: DetailsSchema,
})

export type ZitadelProjectCreateResponse = z.infer<typeof ZitadelProjectCreateResponseSchema>
