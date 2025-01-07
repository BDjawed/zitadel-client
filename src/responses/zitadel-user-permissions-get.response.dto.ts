import type { Details } from './common'

export interface ZitadelUserPermissionsGetResponseDto {
  details: Details
  result: Result[]
}

interface Result {
  userId: string
  details: Details
  roles: string[]
  displayName: string
  iam: boolean
  orgId: string
  projectId: string
  projectGrantId: string
}
