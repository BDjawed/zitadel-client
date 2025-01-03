import type { ZitadelMachineUserAccessTokenType } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserUpdateDto {
  name: string
  description: string
  accessTokenType: ZitadelMachineUserAccessTokenType
}

export interface ZitadelMachineUserUpdatePathDto {
  userId: string
}

export interface ZitadelMachineUserUpdateHeaderDto extends ZitadelOrganizationIdHeaderDto {}
