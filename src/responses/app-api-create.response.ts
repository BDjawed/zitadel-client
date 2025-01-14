import { z } from 'zod'
import { DetailsSchema } from './common'

export const ComplianceProblemSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  localizedMessage: z.string().min(1, 'Localized message is required'),
})

export type ComplianceProblem = z.infer<typeof ComplianceProblemSchema>

export const ZitadelAppOidcCreateResponseSchema = z.object({
  appId: z.string().min(1, 'App ID is required'),
  details: DetailsSchema,
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client secret is required'),
  noneCompliant: z.boolean().optional(),
  complianceProblems: z.array(ComplianceProblemSchema).optional(),
})

export type ZitadelAppOidcCreateResponse = z.infer<typeof ZitadelAppOidcCreateResponseSchema>
