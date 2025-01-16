import type { z } from 'zod'
import { ZitadelUserMetadataByKeyBulkDeleteResponseSchema } from './user-metadata-by-key-bulk-delete.response'

export const ZitadelUserMetadataByKeyBulkCreateResponseSchema = ZitadelUserMetadataByKeyBulkDeleteResponseSchema.extend({})

export type ZitadelUserMetadataByKeyBulkCreateResponse = z.infer<typeof ZitadelUserMetadataByKeyBulkCreateResponseSchema>
