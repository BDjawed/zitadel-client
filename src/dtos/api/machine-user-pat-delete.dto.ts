import type { ZitadelMachineUserByIdGetPathDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserPatDeleteHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserPatDeletePathDto extends ZitadelMachineUserByIdGetPathDto {
  tokenId: string
}
