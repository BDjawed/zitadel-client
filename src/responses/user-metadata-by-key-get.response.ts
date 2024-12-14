import type { Details } from './common'

interface Metadata {
  details: Details
  key: string
  value: string
}
export interface ZitadelUserMetadataByKeyGetResponse {
  metadata: Metadata
}
