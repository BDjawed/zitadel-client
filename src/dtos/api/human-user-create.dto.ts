export interface ZitadelHumanUserCreateDto {
  username: string
  organization: Organization
  profile: Profile
  email: Email
  password: Password
}
interface Email {
  email: string
  isVerified: boolean
}
interface Organization {
  orgId: string
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

export enum ZitadelUserGender {
  MALE = 'GENDER_MALE',
  FEMAL = 'GENDER_FEMALE',
  DIVERSE = 'GENDER_DIVERSE',
  UNSPECIFIED = 'GENDER_UNSPECIFIED',
}
