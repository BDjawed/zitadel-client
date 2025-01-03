import type { ZitadelOrganizationIdHeaderDto } from './common'
import type { ZitadelUserMetadataByKeyPathGetDto } from './user-metadata-by-key-get.dto'

export interface ZitadelUserMetadataByKeyCreatePathDto extends ZitadelUserMetadataByKeyPathGetDto {}

export interface ZitadelUserMetadataByKeyCreateDto {
  value: string
}

export interface ZitadelUserMetadataByKeyCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}
