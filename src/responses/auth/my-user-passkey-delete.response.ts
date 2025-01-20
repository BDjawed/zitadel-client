import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelMyUserPasskeyDeleteResponseSchema = z.object({
  detail: DetailsSchema,
})

export type ZitadelMyUserPasskeyDeleteResponse = z.infer<typeof ZitadelMyUserPasskeyDeleteResponseSchema>
