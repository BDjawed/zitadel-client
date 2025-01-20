import { z } from 'zod'
import { ZitadelUserType } from '../../enums'
import { DetailsSchema } from '../common'

export enum UserGrantState {
  UNSPECIFIED = 'USER_GRANT_STATE_UNSPECIFIED',
  ACTIVE = 'USER_GRANT_STATE_ACTIVE',
  INACTIVE = 'USER_GRANT_STATE_INACTIVE',
}

export const ZitadelUserGrantsResultSchema = z.object({
  orgId: z.string(),
  projectId: z.string(),
  userId: z.string(),
  roles: z.array(z.string()),
  orgName: z.string(),
  grantId: z.string(),
  details: DetailsSchema,
  orgDomain: z.string(),
  projectName: z.string(),
  projectGrantId: z.string(),
  roleKeys: z.array(z.string()),
  userType: z.nativeEnum(ZitadelUserType),
  state: z.nativeEnum(UserGrantState),
})

export const ZitadelMyUserGrantsPostResponseSchema = z.object({
  detail: z.object({
    totalResult: z.string(),
    processedSequence: z.string(),
    viewTimestamp: z.date(),
  }),
  result: z.array(ZitadelUserGrantsResultSchema),
})

export type ZitadelMyUserGrantsPostResponse = z.infer<typeof ZitadelMyUserGrantsPostResponseSchema>
