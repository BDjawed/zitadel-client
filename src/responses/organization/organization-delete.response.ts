import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelOrganizationDeleteResponseSchema = z.object({
  details: DetailsSchema,
})

export type ZitadelOrganizationDeleteResponse = z.infer<typeof ZitadelOrganizationDeleteResponseSchema>
