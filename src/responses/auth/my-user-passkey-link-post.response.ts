import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserPasskeyLinkPostResponseSchema = z.object({
  detail: DetailsSchema,
  link: z.string(),
  expiration: z.string(),
})

export type ZitadelMyUserPasskeyLinkPostResponse = z.infer<typeof ZitadelMyUserPasskeyLinkPostResponseSchema>
