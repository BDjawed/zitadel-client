import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../common'

export const ZitadelUserMetadataByKeyPathGetSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
  key: z.string().min(1, 'Key is required'),
})

export type ZitadelUserMetadataByKeyPathGetDto = z.infer<typeof ZitadelUserMetadataByKeyPathGetSchema>

export const ZitadelUserMetadataByKeyGetHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelUserMetadataByKeyGetHeaderDto = z.infer<typeof ZitadelUserMetadataByKeyGetHeaderSchema>
