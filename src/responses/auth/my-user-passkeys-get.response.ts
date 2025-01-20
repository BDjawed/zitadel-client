import { z } from 'zod'
import { PasskeyResultSchema } from '..'

export const ZitadelMyUserPasskeyGetResponseSchema = z.object({
  result: z.array(PasskeyResultSchema),
})

export type ZitadelMyUserPasskeyGetResponse = z.infer<typeof ZitadelMyUserPasskeyGetResponseSchema>
