import type { ZitadelUserByIdGetPathDto } from '.'

export interface ZitadelUserAuthenticationMethodsPathDto extends ZitadelUserByIdGetPathDto {}

export interface ZitadelUserAuthenticationMethodsGetDto {
  includeWithoutDomain?: boolean
  domain?: string
}
