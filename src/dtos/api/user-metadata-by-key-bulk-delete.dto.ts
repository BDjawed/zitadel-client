import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelUserMetadataByKeyBulkDeleteDto {
  userId: string
  keys: string[]
}

export interface ZitadelUserMetadataByKeyBulkDeleteHeaderDto extends ZitadelOrganizationIdHeaderDto {}
