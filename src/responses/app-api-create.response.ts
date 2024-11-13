import type { Details } from './common'

export interface ZitadelAppOidcCreateResponse {
  appId: string
  details: Details
  clientId: string
  clientSecret: string
  noneCompliant?: boolean
  complianceProblems?: ComplianceProblem[]
}

export interface ComplianceProblem {
  key: string
  localizedMessage: string
}
