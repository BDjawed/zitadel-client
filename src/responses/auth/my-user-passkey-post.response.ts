import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserPasskeyPostResponseSchema = z.object({
  key: z.object({
    publicKey: z.string(),
  }),
  detail: DetailsSchema,
})

export type ZitadelMyUserPasskeyPostResponse = z.infer<typeof ZitadelMyUserPasskeyPostResponseSchema>
