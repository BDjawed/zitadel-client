import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../common'
import { ZitadelUserMetadataByKeyPathGetSchema } from './user-metadata-by-key-get.dto'

export const ZitadelUserMetadataByKeyCreatePathSchema = ZitadelUserMetadataByKeyPathGetSchema.extend({})

export type ZitadelUserMetadataByKeyCreatePathDto = z.infer<typeof ZitadelUserMetadataByKeyCreatePathSchema>

export const ZitadelUserMetadataByKeyCreateSchema = z.object({
  value: z.string().min(1, 'Value is required'),
})

export type ZitadelUserMetadataByKeyCreateDto = z.infer<typeof ZitadelUserMetadataByKeyCreateSchema>

export const ZitadelUserMetadataByKeyCreateHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelUserMetadataByKeyCreateHeaderDto = z.infer<typeof ZitadelUserMetadataByKeyCreateHeaderSchema>
