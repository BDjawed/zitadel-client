import type { Details } from './common'

interface ZitadelUserMetadataResult {
  details: Details
  key: string
  value: string
}
export interface ZitadelUserMetadataSearchGetResponse {
  details: {
    totalResult: string
    processedSequence: string
    viewTimestamp: string
  }
  result: ZitadelUserMetadataResult[]
}
