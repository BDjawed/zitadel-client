import type { ZitadelMachineUserAccessTokenType } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserUpdateDto {
  userId: string
  name: string
  description: string
  accessTokenType: ZitadelMachineUserAccessTokenType
}

export interface ZitadelMachineUserUpdateHeaderDto extends ZitadelOrganizationIdHeaderDto {}
