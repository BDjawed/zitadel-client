import { z } from 'zod'
import { QuerySchema, ZitadelUserByIdGetPathSchema } from '..'
import { ZitadelOrganizationIdHeaderSchema } from '../common'

export const ZitadelUserPermissionsGetPathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserPermissionsGetPathDto = z.infer<typeof ZitadelUserPermissionsGetPathSchema>

export const ZitadelUserPermissionsGetHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelUserPermissionsGetHeaderDto = z.infer<typeof ZitadelUserPermissionsGetHeaderSchema>

export const QueriesSchema = z.object({
  orgQuery: z.object({
    orgId: z.string().min(1, 'Organization ID is required'),
  }).optional(),
  projectQuery: z.object({
    projectId: z.string().min(1, 'Project ID is required'),
  }).optional(),
  projectGrantQuery: z.object({
    projectGrantId: z.string().min(1, 'Project grant ID is required'),
  }).optional(),
  iamQuery: z.object({
    iam: z.boolean(),
  }).optional(),
})

export type Queries = z.infer<typeof QueriesSchema>

export const ZitadelUserPermissionsGetSchema = z.object({
  query: QuerySchema,
  queries: z.array(QueriesSchema),
})

export type ZitadelUserPermissionsGetDto = z.infer<typeof ZitadelUserPermissionsGetSchema>
