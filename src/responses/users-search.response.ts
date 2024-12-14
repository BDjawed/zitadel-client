import type { ZitadelSearchUsersSortingColumn } from '../enums'
import type { ZitadelUserByIdGetResponse } from './user-by-id-get.response'

export interface ZitadelSearchUsersPostResponse {
  details: {
    totalResult: string
    processedSequence: string
    viewTimestamp: string
  }
  sortingColumn: ZitadelSearchUsersSortingColumn
  results: Array<ZitadelUserByIdGetResponse>
}
