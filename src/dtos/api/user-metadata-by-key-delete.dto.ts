import type { ZitadelOrganizationIdHeaderDto } from './common'
import type { ZitadelUserMetadataByKeyGetDto } from './user-metadata-by-key-get.dto'

export interface ZitadelUserMetadataByKeyDeleteDto extends ZitadelUserMetadataByKeyGetDto {}

export interface ZitadelUserMetadataByKeyDeleteHeaderDto extends ZitadelOrganizationIdHeaderDto {}
