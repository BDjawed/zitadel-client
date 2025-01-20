import { z } from 'zod'
import { DetailsSchema } from '../common'

export enum OrganizationState {
  UNSPECIFIED = 'ORG_STATE_UNSPECIFIED',
  ACTIVE = 'ORG_STATE_ACTIVE',
  INACTIVE = 'ORG_STATE_INACTIVE',
  REMOVED = 'ORG_STATE_REMOVED',
}

export const MyOrganizationResultSchema = z.object({
  id: z.string(),
  details: DetailsSchema,
  state: z.nativeEnum(OrganizationState),
  name: z.string(),
  primaryDomain: z.string(),
})

export const ZitadelMyUserOrganizationsPostResponseSchema = z.object({
  detail: z.object({
    totalResult: z.string(),
    processedSequence: z.string(),
    viewTimestamp: z.date(),
  }),
  result: z.array(MyOrganizationResultSchema),
})

export type ZitadelMyUserOrganizationsPostResponse = z.infer<typeof ZitadelMyUserOrganizationsPostResponseSchema>
