interface Details {
  sequence: string
  changeDate?: string
  creationDate?: string
  resourceOwner: string
}

interface MachineUserDetails {
  userId: string
  details: Details
}

interface PersonalAccessToken {
  tokenId: string
  token: string
  details: Details
}

interface MachineUser {
  name: string
  machineUser: MachineUserDetails
  pat: PersonalAccessToken
}

interface Organization {
  details: Details
  organizationId: string
}

interface HumanUser {
  userId: string
  details: Details
}

interface Project {
  id: string
  details: Details
}

interface OidcApp {
  appId: string
  details: Details
  clientId: string
  clientSecret: string
}

export interface ZitadelProvisioningResponse {
  machineUsers: MachineUser[]
  creLandOrganization: Organization
  creLandOrganizationName: string
  creLandHumanUser: HumanUser
  creDashboardProject: Project
  crePaymentsProject: Project
  creBetaOidcApp: OidcApp
  creAlphaOidcApp: OidcApp
  creAlphaOidcAppName: string
}
