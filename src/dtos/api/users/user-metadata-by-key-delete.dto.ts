import type { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../common'
import { ZitadelUserMetadataByKeyPathGetSchema } from './user-metadata-by-key-get.dto'

export const ZitadelUserMetadataByKeyPathDeleteSchema = ZitadelUserMetadataByKeyPathGetSchema.extend({})

export type ZitadelUserMetadataByKeyPathDeleteDto = z.infer<typeof ZitadelUserMetadataByKeyPathDeleteSchema>

export const ZitadelUserMetadataByKeyDeleteHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelUserMetadataByKeyDeleteHeaderDto = z.infer<typeof ZitadelUserMetadataByKeyDeleteHeaderSchema>
