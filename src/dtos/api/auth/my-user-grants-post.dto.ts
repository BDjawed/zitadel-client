import { z } from 'zod'
import { PaginationQuerySchema } from '..'

export const ZitadelUserGrantsPostBodySchema = z.object({
  query: PaginationQuerySchema,
})
export type ZitadelMyUserGrantsPostDto = z.infer<typeof ZitadelUserGrantsPostBodySchema>
