import { z } from 'zod'
import { ZitadelUserHistoryEventSchema } from '..'

export const ZitadelMyUserHistoryGetResponseSchema = z.object({
  result: z.array(ZitadelUserHistoryEventSchema),
})

export type ZitadelMyUserHistoryGetResponse = z.infer<typeof ZitadelMyUserHistoryGetResponseSchema>
