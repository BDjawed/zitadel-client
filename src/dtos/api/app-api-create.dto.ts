import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelAppApiCreateDto {
  name: string
  authMethodType: ZitadelAppApiAuthMethodType
}

export enum ZitadelAppApiAuthMethodType {
  BASIC = 'API_AUTH_METHOD_TYPE_BASIC',
  PRIVATE_KEY_JWT = 'API_AUTH_METHOD_TYPE_PRIVATE_KEY_JWT',
}

export interface ZitadelAppApiCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelAppApiCreatePathDto {
  projectId: string
}
