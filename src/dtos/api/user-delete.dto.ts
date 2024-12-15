import type { ZitadelOrganizationIdHeaderDto } from './common'
import type { ZitadelUserByIdGetDto, ZitadelUserByIdGetPathDto } from './user-by-id-get.dto'

export interface ZitadelUserDeleteHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelUserDeleteDto extends ZitadelUserByIdGetDto {}

export interface ZitadelUserDeletePathDto extends ZitadelUserByIdGetPathDto {}
