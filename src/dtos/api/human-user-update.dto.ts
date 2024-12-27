import type { ZitadelUserGender } from '.'

export interface ZitadelHumanUserUpdateDto {
  username: string
  profile: Profile
  email: Email
  phone: Phone
  password: {
    password: Password
    hashedPassword: HashedPassword
    currentPassword: string
    verificationCode: string
  }
}
interface HashedPassword {
  hash: string
  changeRequired: boolean
}
interface Email {
  email: string
  sendCode: SendCode
  returnCode: object
  isVerified: boolean
}
interface SendCode {
  urlTemplate: string
}
interface Phone {
  phone: string
  sendCode: SendCode
  returnCode: object
  isVerified: boolean
}
interface Password {
  password: string
  changeRequired: boolean
}
interface Profile {
  givenName: string
  familyName: string
  nickName: string
  displayName: string
  preferredLanguage: string
  gender: ZitadelUserGender
}

export interface ZitadelHumanUserUpdatePathDto {
  userId: string
}
