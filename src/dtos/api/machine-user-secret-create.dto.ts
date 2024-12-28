import type { ZitadelUserByIdGetPathDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserSecretCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserSecretCreatePathDto extends ZitadelUserByIdGetPathDto {}

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface ZitadelMachineUserSecretCreateDto {}
