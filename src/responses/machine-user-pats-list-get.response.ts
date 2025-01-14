import { z } from 'zod'
import { TokenSchema } from '.'

export const ZitadelMachineUserPatsListGetResponseSchema = z.object({
  details: z.object({
    totalResult: z.string(),
    processedSequence: z.string(),
    viewTimestamp: z.string(),
  }),
  result: z.array(TokenSchema),
})

export type ZitadelMachineUserPatsListGetResponse = z.infer<typeof ZitadelMachineUserPatsListGetResponseSchema>
