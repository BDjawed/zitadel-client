import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserCreateDto {
  userName: string
  name: string
  description: string
  accessTokenType: ZitadelMachineUserAccessTokenType
}

export interface ZitadelMachineUserCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export enum ZitadelMachineUserAccessTokenType {
  BEARER = 'ACCESS_TOKEN_TYPE_BEARER',
  JWT = 'ACCESS_TOKEN_TYPE_JWT',
}
