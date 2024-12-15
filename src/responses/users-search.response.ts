import type { ZitadelUsersSearchSortingColumn, ZitadelUserStateType } from '../enums'
import type { Details } from './common'
import type { ZitadelHumanUserDto, ZitadelMachineUserDto } from './user-by-id-get.response'

interface ZitadelUser {
  userId: string
  details: Details
  state: ZitadelUserStateType
  userName: string
  loginNames: string[]
  preferredLoginName: string
  human: ZitadelHumanUserDto
  machine: ZitadelMachineUserDto
}
export interface ZitadelUsersSearchPostResponse {
  details: {
    totalResult: string
    processedSequence: string
    timestamp: Date
  }
  sortingColumn: ZitadelUsersSearchSortingColumn
  results: Array<ZitadelUser>
}
