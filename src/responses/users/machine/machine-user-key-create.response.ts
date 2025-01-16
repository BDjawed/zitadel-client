import { z } from 'zod'
import { DetailsSchema } from '../../common'

export const ZitadelMachineUserKeyCreateResponseSchema = z.object({
  keyId: z.string(),
  keyDetails: z.string(),
  details: DetailsSchema,
})

export type ZitadelMachineUserKeyCreateResponse = z.infer<typeof ZitadelMachineUserKeyCreateResponseSchema>
