import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelUserByIdGetHeaderDto extends ZitadelOrganizationIdHeaderDto {}
export interface ZitadelUserByIdGetDto {
  userId: string
}

export interface ZitadelUserByIdGetPathDto {
  projectId: string
}
