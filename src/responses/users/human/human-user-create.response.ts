import { z } from 'zod'
import { DetailsSchema } from '../../common'

export const ZitadelHumanUserCreateResponseSchema = z.object({
  userId: z.string().optional(),
  details: DetailsSchema,
  emailCode: z.string().optional(),
  phoneCode: z.string().optional(),
})

export type ZitadelHumanUserCreateResponse = z.infer<typeof ZitadelHumanUserCreateResponseSchema>
