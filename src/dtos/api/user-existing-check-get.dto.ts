import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelUserExistingCheckGetDto {
  userName: string
  email: string
}

export type ZitadelUserExistingCheckByUserNameOrEmailDto = | { userName: string, email?: undefined }
  | { userName?: undefined, email: string }

export interface ZitadelUserExistingCheckGetHeaderDto extends ZitadelOrganizationIdHeaderDto { }
