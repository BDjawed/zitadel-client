import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserPasskeyVerifyPostResponseSchema = z.object({
  detail: DetailsSchema,
})

export type ZitadelMyUserPasskeyVerifyPostResponse = z.infer<typeof ZitadelMyUserPasskeyVerifyPostResponseSchema>
