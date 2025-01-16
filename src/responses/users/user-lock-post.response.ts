import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelUserLockPostResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelUserLockPostResponse = z.infer<typeof ZitadelUserLockPostResponseSchema>
