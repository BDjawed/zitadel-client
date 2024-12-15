import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelUserMetadata {
  key: string
  value: string
}
export interface ZitadelUserMetadataByKeyBulkCreateDto {
  userId: string
  metadata: ZitadelUserMetadata[]
}

export interface ZitadelUserMetadataByKeyBulkCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}
