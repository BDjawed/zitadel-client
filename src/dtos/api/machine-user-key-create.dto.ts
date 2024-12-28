import type { ZitadelUserByIdGetPathDto } from '.'
import type { ZitadelMachineUserKeyType } from '../../responses'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserKeyCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserKeyCreatePathDto extends ZitadelUserByIdGetPathDto {}

export interface ZitadelMachineUserKeyCreateDto {
  type: ZitadelMachineUserKeyType
  expirationDate: string
  publicKey?: string
}
