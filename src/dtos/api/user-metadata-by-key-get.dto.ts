import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelUserMetadataByKeyGetDto {
  userId: string
  key: string
}

export interface ZitadelUserMetadataByKeyGetHeaderDto extends ZitadelOrganizationIdHeaderDto { }
