import type { Token } from '.'

export interface ZitadelMachineUserPatsListGetResponse {
  details: {
    totalResult: string
    processedSequence: string
    viewTimestamp: string
  }
  token: Token[]
}
