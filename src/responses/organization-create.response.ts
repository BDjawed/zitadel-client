import type { Details } from './common'

export interface ZitadelOrganizationCreateResponse {
  details: Details
  organizationId: string
  createdAdmins: CreatedAdmins[]
}

interface CreatedAdmins {
  userId: string
  emailCode: string
  phoneCode: string
}
