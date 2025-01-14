import { z } from 'zod'
import { DetailsSchema } from './common'

export const ZitadelMachineUserCreateResponseSchema = z.object({
  userId: z.string(),
  details: DetailsSchema,
})

export type ZitadelMachineUserCreateResponse = z.infer<typeof ZitadelMachineUserCreateResponseSchema>
