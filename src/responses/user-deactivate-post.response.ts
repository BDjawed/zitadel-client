import { z } from 'zod'
import { DetailsSchema } from './common'

export const ZitadelUserDeactivatePostResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelUserDeactivatePostResponse = z.infer<typeof ZitadelUserDeactivatePostResponseSchema>
