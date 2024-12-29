import type { ZitadelMachineUserByIdGetPathDto, ZitadelMachineUserKeysGetDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserPatsListGetHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserPatsListGetPathDto extends ZitadelMachineUserByIdGetPathDto {}

export interface ZitadelMachineUserPatsListGetDto extends ZitadelMachineUserKeysGetDto {}
