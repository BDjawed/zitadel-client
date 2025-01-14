export interface ZitadelHumanUserCreateDto {
  userId?: string
  username?: string
  organization?: Organization
  profile: Profile
  email: Email
  phone?: Phone
  metadata?: Metadata[]
  password?: Password
  hashedPassword?: HashedPassword
  idpLinks?: IdpLink[]
  totpSecret?: string
}

export interface IdpLink {
  idpId?: string
  userId?: string
  userName?: string
}
interface HashedPassword {
  hash: string
  changeRequired?: boolean
}

export interface Metadata {
  key: string
  value: string
}
interface Phone {
  phone?: string
  sendCode?: object
  returnCode?: object
  isVerified?: boolean
}
interface Email {
  email: string
  sendCode?: SendCode
  returnCode?: object
  isVerified?: boolean
}

interface SendCode {
  urlTemplate: string
}
interface Organization {
  orgId?: string
  orgDomain?: string
}
interface Password {
  password: string
  changeRequired?: boolean
}
interface Profile {
  givenName: string
  familyName: string
  nickName?: string
  displayName?: string
  preferredLanguage?: string
  gender?: ZitadelUserGender
}

export enum ZitadelUserGender {
  MALE = 'GENDER_MALE',
  FEMAL = 'GENDER_FEMALE',
  DIVERSE = 'GENDER_DIVERSE',
  UNSPECIFIED = 'GENDER_UNSPECIFIED',
}
