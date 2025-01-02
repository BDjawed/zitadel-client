import type { ZitadelUserByIdGetPathDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserPatGetHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserPatGetPathDto extends ZitadelUserByIdGetPathDto {
  tokenId: string
}
