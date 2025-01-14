import { z } from 'zod'
import { DetailsSchema } from './common'

export const ZitadelUserMetadataResultSchema = z.object({
  details: DetailsSchema,
  key: z.string(),
  value: z.string(),
})

export const ZitadelUserMetadataSearchGetResponseSchema = z.object({
  details: z.object({
    totalResult: z.string(),
    processedSequence: z.string(),
    viewTimestamp: z.string(),
  }),
  result: z.array(ZitadelUserMetadataResultSchema),
})

export type ZitadelUserMetadataResult = z.infer<typeof ZitadelUserMetadataResultSchema>
export type ZitadelUserMetadataSearchGetResponse = z.infer<typeof ZitadelUserMetadataSearchGetResponseSchema>
