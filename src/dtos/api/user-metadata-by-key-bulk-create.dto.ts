import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelUserMetadata {
  key: string
  value: string
}
export interface ZitadelUserMetadataByKeyBulkCreateDto {
  metadata: ZitadelUserMetadata[]
}

export interface ZitadelUserMetadataByKeyBulkCreatePathDto {
  userId: string
}

export interface ZitadelUserMetadataByKeyBulkCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}
