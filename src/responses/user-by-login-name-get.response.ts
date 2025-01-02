import type { ZitadelUserStateType } from '../enums'
import type { Details } from './common'
import type { ZitadelHumanUserDto, ZitadelMachineUserDto } from './user-by-id-get.response'

interface User {
  id: string
  details: Details
  state: ZitadelUserStateType
  userName: string
  loginNames: string[]
  preferredLoginName: string
  human: ZitadelHumanUserDto
  machine: ZitadelMachineUserDto
}

export interface ZitadelUserByLoginNameGetResponse {
  user: User
}
