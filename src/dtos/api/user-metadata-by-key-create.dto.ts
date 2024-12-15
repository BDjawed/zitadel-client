import type { ZitadelOrganizationIdHeaderDto } from './common'
import type { ZitadelUserMetadataByKeyGetDto } from './user-metadata-by-key-get.dto'

export interface ZitadelUserMetadataByKeyCreateDto extends ZitadelUserMetadataByKeyGetDto {
  value: string
}

export interface ZitadelUserMetadataByKeyCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}
