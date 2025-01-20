import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserAvatarDeleteResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelMyUserAvatarDeleteResponse = z.infer<typeof ZitadelMyUserAvatarDeleteResponseSchema>
