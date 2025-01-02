import type { ZitadelUserByIdGetPathDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserPatDeleteHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserPatDeletePathDto extends ZitadelUserByIdGetPathDto {
  tokenId: string
}
