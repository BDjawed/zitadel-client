import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../common'

export const ZitadelAppClientSecretCreateHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelAppClientSecretCreateHeaderDto = z.infer<typeof ZitadelAppClientSecretCreateHeaderSchema>

export const ZitadelAppClientSecretCreatePathSchema = z.object({
  appId: z.string(),
  projectId: z.string(),
})

export type ZitadelAppClientSecretCreatePathDto = z.infer<typeof ZitadelAppClientSecretCreatePathSchema>
