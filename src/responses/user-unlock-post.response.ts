import { z } from 'zod'
import { DetailsSchema } from './common'

export const ZitadelUserUnlockPostResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelUserUnlockPostResponse = z.infer<typeof ZitadelUserUnlockPostResponseSchema>
