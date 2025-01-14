import { z } from 'zod'
import { DetailsSchema } from './common'

const MetadataSchema = z.object({
  details: DetailsSchema,
  key: z.string(),
  value: z.string(),
})

export const ZitadelUserMetadataByKeyGetResponseSchema = z.object({
  metadata: MetadataSchema,
})

// type Metadata = z.infer<typeof MetadataSchema>
export type ZitadelUserMetadataByKeyGetResponse = z.infer<typeof ZitadelUserMetadataByKeyGetResponseSchema>
