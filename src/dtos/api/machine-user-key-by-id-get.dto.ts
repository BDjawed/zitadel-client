import type { ZitadelUserByIdGetPathDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserKeyByIdGetHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserKeyByIdGetPathDto extends ZitadelUserByIdGetPathDto {
  keyId: string
}
