import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelUserMetadataByKeyBulkDeleteDto {
  keys: string[]
}

export interface ZitadelUserMetadataByKeyBulkPathDeleteDto {
  userId: string
}

export interface ZitadelUserMetadataByKeyBulkDeleteHeaderDto extends ZitadelOrganizationIdHeaderDto {}
