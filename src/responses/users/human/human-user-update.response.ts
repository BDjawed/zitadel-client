import { z } from 'zod'

const DetailsSchema = z.object({
  sequence: z.string(),
  changeDate: z.string().optional(),
  creationDate: z.string().optional(),
  resourceOwner: z.string(),
})

export const ZitadelHumanUserUpdateResponseSchema = z.object({
  details: DetailsSchema,
  emailCode: z.string().min(1, 'Email code is required'),
  phoneCode: z.string().min(1, 'Phone code is required'),
})

export type ZitadelHumanUserUpdateResponse = z.infer<typeof ZitadelHumanUserUpdateResponseSchema>
