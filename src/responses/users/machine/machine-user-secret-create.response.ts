import { z } from 'zod'
import { DetailsSchema } from '../../common'

export const ZitadelMachineUserSecretCreateResponseSchema = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  details: DetailsSchema,
})

export type ZitadelMachineUserSecretCreateResponse = z.infer<typeof ZitadelMachineUserSecretCreateResponseSchema>
