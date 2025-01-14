import { z } from 'zod'
import { DetailsSchema } from './common'

export const ZitadelMachineUserSecretDeleteResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMachineUserSecretDeleteResponse = z.infer<typeof ZitadelMachineUserSecretDeleteResponseSchema>
