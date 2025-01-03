import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelUserMetadataByKeyPathGetDto {
  userId: string
  key: string
}

export interface ZitadelUserMetadataByKeyGetHeaderDto extends ZitadelOrganizationIdHeaderDto { }
