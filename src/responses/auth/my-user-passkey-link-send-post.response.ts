import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserPasskeyLinkSendPostResponseSchema = z.object({
  detail: DetailsSchema,
})

export type ZitadelMyUserPasskeyLinkSendPostResponse = z.infer<typeof ZitadelMyUserPasskeyLinkSendPostResponseSchema>
