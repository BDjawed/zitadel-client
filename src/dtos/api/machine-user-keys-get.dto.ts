import type { ZitadelUserByIdGetPathDto } from '.'
import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserKeysGetHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserKeysGetPathDto extends ZitadelUserByIdGetPathDto {}

export interface ZitadelMachineUserKeysGetDto {
  query: Query
}

export interface Query {
  offset: string
  limit: number
  asc: boolean
}
