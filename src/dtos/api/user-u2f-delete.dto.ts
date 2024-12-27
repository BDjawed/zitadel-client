import type { ZitadelUserByIdGetPathDto } from '.'

export interface ZitadelUserU2fDeletePathDto extends ZitadelUserByIdGetPathDto {
  u2fId: string
}
