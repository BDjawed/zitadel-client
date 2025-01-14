import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from './common'

export const ZitadelAppApiDeletePathSchema = z.object({
  projectId: z.string().uuid('Project ID must be a valid UUID'),
  appId: z.string(),
})

export type ZitadelAppApiDeletePathDto = z.infer<typeof ZitadelAppApiDeletePathSchema>

export const ZitadelAppApiDeleteHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelAppApiDeleteHeaderDto = z.infer<typeof ZitadelAppApiDeleteHeaderSchema>
