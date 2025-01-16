import type { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../common'

export const ZitadelOrganizationDeleteHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelOrganizationDeleteHeaderDto = z.infer<typeof ZitadelOrganizationDeleteHeaderSchema>
