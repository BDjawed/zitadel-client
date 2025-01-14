import { z } from 'zod'
import { DetailsSchema } from './common'

export const ZitadelUserMetadataByKeyDeleteResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelUserMetadataByKeyDeleteResponse = z.infer<typeof ZitadelUserMetadataByKeyDeleteResponseSchema>
