import type { ZitadelMachineUserAccessTokenType, ZitadelUserGender } from '../dtos'
import type { ZitadelUserStateType } from '../enums'
import type { Details } from './common'

export interface ZitadelHumanUserDto {
  userId: string
  state: ZitadelUserStateType
  userName: string
  loginNames: string[]
  preferredLoginName: string
  profile: {
    givenName: string
    familyName: string
    nickName: string
    displayName: string
    preferredLanguage: string
    gender: ZitadelUserGender
    avatarUrl: string
  }
  email: {
    email: string
    isEmailVerified: boolean
  }
  phone: {
    phone: string
    isVerified: boolean
  }
  passwordChangeRequired: boolean
  passwordChanged: Date
}

export interface ZitadelMachineUserDto {
  name: string
  description: string
  hasSecret: boolean
  accessTokenType: ZitadelMachineUserAccessTokenType
}

export interface ZitadelUserByIdGetResponse {
  details: Details
  user: {
    userId: string
    details: Details
    state: ZitadelUserStateType
    userName: string
    loginNames: string[]
    preferredLoginName: string
    human: ZitadelHumanUserDto
    machine: ZitadelMachineUserDto
  }
}
