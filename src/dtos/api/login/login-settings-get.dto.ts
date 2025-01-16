import type { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../common'

export const ZitadelLoginSettingsGetHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelLoginSettingsGetHeaderDto = z.infer<typeof ZitadelLoginSettingsGetHeaderSchema>
