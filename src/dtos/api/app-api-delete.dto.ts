import type { ZitadelAppApiCreatePathDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelAppApiDeletePathDto extends ZitadelAppApiCreatePathDto {
  appId: string
}

export interface ZitadelAppApiDeleteHeaderDto extends ZitadelOrganizationIdHeaderDto {}
