import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelUserMetadataByKeyBulkDeleteResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelUserMetadataByKeyBulkDeleteResponse = z.infer<typeof ZitadelUserMetadataByKeyBulkDeleteResponseSchema>
