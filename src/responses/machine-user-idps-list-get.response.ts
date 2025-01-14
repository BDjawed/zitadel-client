import { z } from 'zod'

export const ZitadelMachineUserIdpsListGetResponseSchema = z.object({
  details: z.object({
    totalResult: z.string(),
    processedSequence: z.string(),
    timestamp: z.string(),
  }),
  result: z.array(z.object({
    idpId: z.string(),
    userId: z.string(),
    userName: z.string(),
  })).optional(),
})

export type ZitadelMachineUserIdpsListGetResponse = z.infer<typeof ZitadelMachineUserIdpsListGetResponseSchema>
