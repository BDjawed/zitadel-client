import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../common'

export enum ZitadelAppApiAuthMethodType {
  BASIC = 'API_AUTH_METHOD_TYPE_BASIC',
  PRIVATE_KEY_JWT = 'API_AUTH_METHOD_TYPE_PRIVATE_KEY_JWT',
}

export const ZitadelAppApiCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  authMethodType: z.nativeEnum(ZitadelAppApiAuthMethodType),
})

export const ZitadelAppApiCreateHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export const ZitadelAppApiCreatePathSchema = z.object({
  projectId: z.string().uuid('Project ID must be a valid UUID'),
})

export type ZitadelAppApiCreateDto = z.infer<typeof ZitadelAppApiCreateSchema>
export type ZitadelAppApiCreateHeaderDto = z.infer<typeof ZitadelAppApiCreateHeaderSchema>
export type ZitadelAppApiCreatePathDto = z.infer<typeof ZitadelAppApiCreatePathSchema>
