import { z } from 'zod'
import { ZitadelTextQueryMethod } from '../../../enums'
import { ZitadelOrganizationIdHeaderSchema } from '../common'

export const ZitadelMetadataKeyQuerySchema = z.object({
  keyQuery: z.object({
    key: z.string().min(1, 'Key is required'),
    method: z.nativeEnum(ZitadelTextQueryMethod),
  }),
})

export type ZitadelMetadataKeyQuery = z.infer<typeof ZitadelMetadataKeyQuerySchema>

export const ZitadelUserMetadataSearchSchema = z.object({
  query: z.object({
    offset: z.string().min(1, 'Offset is required'),
    limit: z.number().min(1, 'Limit is required'),
    asc: z.boolean(),
  }),
  queries: z.array(ZitadelMetadataKeyQuerySchema),
})

export type ZitadelUserMetadataSearchDto = z.infer<typeof ZitadelUserMetadataSearchSchema>

export const ZitadelUserMetadataSearchPathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelUserMetadataSearchPathDto = z.infer<typeof ZitadelUserMetadataSearchPathSchema>

export const ZitadelUserMetadataSearchHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelUserMetadataSearchHeaderDto = z.infer<typeof ZitadelUserMetadataSearchHeaderSchema>
