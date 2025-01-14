import { z } from 'zod'

export const ZitadelUserHistoryEventSchema = z.object({
  changeDate: z.date(),
  eventType: z.object({
    key: z.string(),
    localizedMessage: z.string(),
  }),
  sequence: z.string(),
  editorId: z.string(),
  editorDisplayName: z.string(),
  resourceOwnerId: z.string(),
  editorPreferredLoginName: z.string(),
  editorAvatarUrl: z.string(),
})

export const ZitadelUserHistoryPostResponseSchema = z.object({
  result: z.array(ZitadelUserHistoryEventSchema),
})

export type ZitadelUserHistoryEvent = z.infer<typeof ZitadelUserHistoryEventSchema>
export type ZitadelUserHistoryPostResponse = z.infer<typeof ZitadelUserHistoryPostResponseSchema>
