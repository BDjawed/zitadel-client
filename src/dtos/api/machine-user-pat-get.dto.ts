import type { ZitadelMachineUserByIdGetPathDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserPatGetHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserPatGetPathDto extends ZitadelMachineUserByIdGetPathDto {
  tokenId: string
}
