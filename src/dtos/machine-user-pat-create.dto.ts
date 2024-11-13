import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelMachineUserPatCreateDto {
  expirationDate: Date
}

export interface ZitadelMachineUserPatCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelMachineUserPatCreatePathDto {
  userId: string
}
