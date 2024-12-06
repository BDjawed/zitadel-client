import type { ZitadelMachineUserAccessTokenType, ZitadelUserGender } from '../dtos'
import type { ZitadelUserStateType } from '../enums'
import type { Details } from './common'

export interface ZitadelHumanUserDto {
  profile: {
    firstName: string
    lastName: string
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
    isPhoneVerified: boolean
  }
  passwordChanged: Date
}

export interface ZitadelMachineUserDto {
  name: string
  description: string
  hasSecret: boolean
  accessTokenType: ZitadelMachineUserAccessTokenType
}

export interface ZitadelUserByIdGetResponse {
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
