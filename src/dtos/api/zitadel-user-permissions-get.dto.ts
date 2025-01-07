import type { Query, ZitadelUserByIdGetPathDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelUserPermissionsGetPathDto extends ZitadelUserByIdGetPathDto {}

export interface ZitadelUserPermissionsGetHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelUserPermissionsGetDto {
  query: Query
  queries: Queries[]
}

interface Queries {
  orgQuery?: {
    orgId: string
  }
  projectQuery?: {
    projectId: string
  }
  projectGrantQuery?: {
    projectGrantId: string
  }
  iamQuery?: {
    iam: boolean
  }
}
