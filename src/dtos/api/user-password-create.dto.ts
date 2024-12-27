import type { ZitadelUserByIdGetPathDto } from '.'

export interface ZitadelUserPasswordCreateDto {
  newPassword: NewPassword
  currentPassword: string
  verificationCode: string
}

export interface NewPassword {
  password: string
  changeRequired?: boolean
}

export interface ZitadelUserPasswordCreatePathDto extends ZitadelUserByIdGetPathDto {}
