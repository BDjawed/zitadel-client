import type { Query, ZitadelUserByIdGetPathDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserPatsListGetHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserPatsListGetPathDto extends ZitadelUserByIdGetPathDto {}

export interface ZitadelMachineUserPatsListGetDto extends Query {}
