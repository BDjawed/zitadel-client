import { z } from 'zod'

export const DetailsSchema = z.object({
  sequence: z.string(),
  changeDate: z.string().optional(),
  creationDate: z.string().optional(),
  resourceOwner: z.string(),
})

export const MachineUserDetailsSchema = z.object({
  userId: z.string(),
  details: DetailsSchema,
})

export const PersonalAccessTokenSchema = z.object({
  tokenId: z.string(),
  token: z.string(),
  details: DetailsSchema,
})

export const MachineUserSchema = z.object({
  name: z.string(),
  machineUser: MachineUserDetailsSchema,
  pat: PersonalAccessTokenSchema,
})

export const OrganizationSchema = z.object({
  details: DetailsSchema,
  organizationId: z.string(),
})

export const HumanUserSchema = z.object({
  userId: z.string(),
  details: DetailsSchema,
})

export const ProjectSchema = z.object({
  id: z.string(),
  details: DetailsSchema,
})

export const OidcAppSchema = z.object({
  appId: z.string(),
  details: DetailsSchema,
  clientId: z.string(),
  clientSecret: z.string(),
})

export const ZitadelProvisioningResponseSchema = z.object({
  machineUsers: z.array(MachineUserSchema),
  creLandOrganization: OrganizationSchema,
  creLandOrganizationName: z.string(),
  creLandHumanUser: HumanUserSchema,
  creDashboardProject: ProjectSchema,
  crePaymentsProject: ProjectSchema,
  creBetaOidcApp: OidcAppSchema,
  creAlphaOidcApp: OidcAppSchema,
  creAlphaOidcAppName: z.string(),
})

export type Details = z.infer<typeof DetailsSchema>
export type MachineUserDetailsResponse = z.infer<typeof MachineUserDetailsSchema>
export type PersonalAccessTokenResponse = z.infer<typeof PersonalAccessTokenSchema>
export type MachineUserResponse = z.infer<typeof MachineUserSchema>
export type OrganizationResponse = z.infer<typeof OrganizationSchema>
export type HumanUserResponse = z.infer<typeof HumanUserSchema>
export type ProjectResponse = z.infer<typeof ProjectSchema>
export type OidcAppResponse = z.infer<typeof OidcAppSchema>
export type ZitadelProvisioningResponse = z.infer<typeof ZitadelProvisioningResponseSchema>
