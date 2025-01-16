import { z } from 'zod'
import { ZitadelUserMetadataByKeyDeleteResponseSchema } from './user-metadata-by-key-delete.response'

export const ZitadelUserMetadataByKeyCreateResponseSchema = ZitadelUserMetadataByKeyDeleteResponseSchema.extend({
  id: z.string(),
})

export type ZitadelUserMetadataByKeyCreateResponse = z.infer<typeof ZitadelUserMetadataByKeyCreateResponseSchema>
