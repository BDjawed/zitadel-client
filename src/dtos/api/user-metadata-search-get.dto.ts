import type { ZitadelTextQueryMethod } from '../../enums'
import type { ZitadelOrganizationIdHeaderDto } from './common'

interface ZitadelMetadataKeyQuery {
  keyQuery: {
    key: string
    method: ZitadelTextQueryMethod
  }
}

export interface ZitadelUserMetadataSearchDto {
  query: {
    offset: string
    limit: number
    asc: boolean
  }
  queries: Array<ZitadelMetadataKeyQuery>
}

export interface ZitadelUserMetadataSearchPathDto {
  userId: string
}

export interface ZitadelUserMetadataSearchHeaderDto extends ZitadelOrganizationIdHeaderDto {}
