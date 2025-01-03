import type { ZitadelUserByIdGetPathDto } from '.'

export interface ZitadelUserAuthenticationMethodsPathDto extends ZitadelUserByIdGetPathDto {}

export interface ZitadelUserAuthenticationMethodsGetQueryDto {
  includeWithoutDomain?: boolean
  domain?: string
}
