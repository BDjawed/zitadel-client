import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from './common'

export const ZitadelUserMetadataByKeyBulkDeleteSchema = z.object({
  keys: z.array(z.string().min(1, 'Key is required')),
})

export type ZitadelUserMetadataByKeyBulkDeleteDto = z.infer<typeof ZitadelUserMetadataByKeyBulkDeleteSchema>

export const ZitadelUserMetadataByKeyBulkPathDeleteSchema = z.object({
  userId: z.string().min(1, 'UserID is required'),
})

export type ZitadelUserMetadataByKeyBulkPathDeleteDto = z.infer<typeof ZitadelUserMetadataByKeyBulkPathDeleteSchema>

export const ZitadelUserMetadataByKeyBulkDeleteHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelUserMetadataByKeyBulkDeleteHeaderDto = z.infer<typeof ZitadelUserMetadataByKeyBulkDeleteHeaderSchema>
