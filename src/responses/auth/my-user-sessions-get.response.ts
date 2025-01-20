import { z } from 'zod'
import { DetailsSchema } from '../common'

export enum ZitadelAuthState {
  UNSPECIFIED = 'SESSION_STATE_UNSPECIFIED',
  ACTIVE = 'SESSION_STATE_ACTIVE',
  TERMINATED = 'SESSION_STATE_TERMINATED',
}

export const ZitadelSessionsResult = z.object({
  sessionId: z.string(),
  agentId: z.string(),
  authState: z.nativeEnum(ZitadelAuthState),
  userId: z.string(),
  userName: z.string(),
  loginName: z.string(),
  displayName: z.string(),
  details: DetailsSchema,
  avatarUrl: z.string(),
})

export const ZitadelMyUserSessionsGetResponseSchema = z.object({
  result: z.array(ZitadelSessionsResult),
})

export type ZitadelMyUserSessionsGetResponse = z.infer<typeof ZitadelMyUserSessionsGetResponseSchema>
