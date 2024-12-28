import type { ZitadelUserByIdGetPathDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserByIdGetHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserByIdGetPathDto extends ZitadelUserByIdGetPathDto {
  keyId: string
}
