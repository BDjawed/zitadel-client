import { z } from 'zod'
import { ZitadelUserHistoryQueryPostBodySchema as QuerySchema } from '..'

export const ZitadelUserHistoryPostBodySchema = z.object({
  query: QuerySchema,
})
export type ZitadelMyUserHistoryPostDto = z.infer<typeof ZitadelUserHistoryPostBodySchema>
