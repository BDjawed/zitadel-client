import type { ZitadelUserByIdGetDto, ZitadelUserByIdGetHeaderDto, ZitadelUserByIdGetPathDto } from './user-by-id-get.dto'

export interface ZitadelUserDeleteHeaderDto extends ZitadelUserByIdGetHeaderDto {}

export interface ZitadelUserDeleteDto extends ZitadelUserByIdGetDto {}

export interface ZitadelUserDeletePathDto extends ZitadelUserByIdGetPathDto {}
