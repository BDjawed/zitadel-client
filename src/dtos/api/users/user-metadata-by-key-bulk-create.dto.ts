import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../common'

export const ZitadelUserMetadataSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
})

export type ZitadelUserMetadata = z.infer<typeof ZitadelUserMetadataSchema>

export const ZitadelUserMetadataByKeyBulkCreateSchema = z.object({
  metadata: z.array(ZitadelUserMetadataSchema),
})

export type ZitadelUserMetadataByKeyBulkCreateDto = z.infer<typeof ZitadelUserMetadataByKeyBulkCreateSchema>

export const ZitadelUserMetadataByKeyBulkCreatePathSchema = z.object({
  userId: z.string().min(1, 'UserID is required'),
})

export type ZitadelUserMetadataByKeyBulkCreatePathDto = z.infer<typeof ZitadelUserMetadataByKeyBulkCreatePathSchema>

export const ZitadelUserMetadataByKeyBulkCreateHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelUserMetadataByKeyBulkCreateHeaderDto = z.infer<typeof ZitadelUserMetadataByKeyBulkCreateHeaderSchema>
