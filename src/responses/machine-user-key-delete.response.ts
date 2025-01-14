import { z } from 'zod'
import { DetailsSchema } from './common'

export const ZitadelMachineUserKeyDeleteResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMachineUserKeyDeleteResponse = z.infer<typeof ZitadelMachineUserKeyDeleteResponseSchema>
