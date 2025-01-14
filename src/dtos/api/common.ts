import { z } from 'zod'

export const ZitadelOrganizationIdHeaderSchema = z.object({
  'x-zitadel-orgid': z.string(),
})

export type ZitadelOrganizationIdHeaderDto = z.infer<typeof ZitadelOrganizationIdHeaderSchema>
