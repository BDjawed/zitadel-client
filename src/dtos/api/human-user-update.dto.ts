import type { ZitadelUserGender } from '.'

export interface ZitadelHumanUserUpdateDto {
  username: string
  profile: Profile
  email: Email
  phone?: Phone
  password: {
    password: Password
    hashedPassword?: HashedPassword
    currentPassword?: string
    verificationCode?: string
  }
}
export interface HashedPassword {
  hash: string
  changeRequired?: boolean
}
export interface Email {
  email: string
  sendCode?: SendCode
  returnCode?: object
  isVerified?: boolean
}
interface SendCode {
  urlTemplate: string
}
export interface Phone {
  phone: string
  sendCode: SendCode
  returnCode: object
  isVerified: boolean
}
export interface Password {
  password: string
  changeRequired?: boolean
}
export interface Profile {
  givenName: string
  familyName: string
  nickName?: string
  displayName?: string
  preferredLanguage?: string
  gender?: ZitadelUserGender
}

export interface ZitadelHumanUserUpdatePathDto {
  userId: string
}
