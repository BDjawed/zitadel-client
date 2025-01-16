import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelAppClientSecretCreateResponseSchema = z.object({
  clientSecret: z.string().min(1, 'Client secret is required'),
  details: DetailsSchema,
})

export type ZitadelAppClientSecretCreateResponse = z.infer<typeof ZitadelAppClientSecretCreateResponseSchema>
