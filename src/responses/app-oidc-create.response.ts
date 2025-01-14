import { z } from 'zod'
import { DetailsSchema } from './common'

export const ZitadelAppApiCreateResponseSchema = z.object({
  appId: z.string().min(1, 'App ID is required'),
  details: DetailsSchema,
  clientId: z.string().min(1, 'Client ID is required'),
})

export type ZitadelAppApiCreateResponse = z.infer<typeof ZitadelAppApiCreateResponseSchema>
