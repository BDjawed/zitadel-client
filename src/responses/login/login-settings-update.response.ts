import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelLoginSettingsUpdateResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelLoginSettingsUpdateResponse = z.infer<typeof ZitadelLoginSettingsUpdateResponseSchema>
