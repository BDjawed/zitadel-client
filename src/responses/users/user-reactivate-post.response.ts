import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelUserReactivatePostResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelUserReactivatePostResponse = z.infer<typeof ZitadelUserReactivatePostResponseSchema>
