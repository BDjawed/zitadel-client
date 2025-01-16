import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelUserEmailCreateResponseSchema = z.object({
  details: DetailsSchema,
  verificationCode: z.string(),
})

export type ZitadelUserEmailCreateResponse = z.infer<typeof ZitadelUserEmailCreateResponseSchema>
