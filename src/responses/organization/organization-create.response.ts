import { z } from 'zod'
import { DetailsSchema } from '../common'

export const CreatedAdminsSchema = z.object({
  userId: z.string(),
  emailCode: z.string(),
  phoneCode: z.string(),
})

export const ZitadelOrganizationCreateResponseSchema = z.object({
  details: DetailsSchema,
  organizationId: z.string(),
  createdAdmins: z.array(CreatedAdminsSchema),
})

export type CreatedAdmins = z.infer<typeof CreatedAdminsSchema>
export type ZitadelOrganizationCreateResponse = z.infer<typeof ZitadelOrganizationCreateResponseSchema>
