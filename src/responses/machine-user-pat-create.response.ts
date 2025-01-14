import { z } from 'zod'
import { DetailsSchema } from './common'

export const ZitadelMachineUserPatCreateResponseSchema = z.object({
  tokenId: z.string(),
  token: z.string(),
  details: DetailsSchema,
})

export type ZitadelMachineUserPatCreateResponse = z.infer<typeof ZitadelMachineUserPatCreateResponseSchema>
