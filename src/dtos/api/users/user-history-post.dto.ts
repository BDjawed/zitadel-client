import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../common'

export const ZitadelUserHistoryQueryPostBodySchema = z.object({
  sequence: z.string().min(1, 'Sequence is required'),
  limit: z.number().min(1, 'Limit is required'),
  asc: z.boolean(),
})

export type ZitadelUserHistoryPostBodyDto = z.infer<typeof ZitadelUserHistoryQueryPostBodySchema>

export const ZitadelUserHistoryPostSchema = z.object({
  query: ZitadelUserHistoryQueryPostBodySchema,
})

export type ZitadelUserHistoryPostDto = z.infer<typeof ZitadelUserHistoryPostSchema>

export const ZitadelUserHistoryPostHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelUserHistoryPostHeaderDto = z.infer<typeof ZitadelUserHistoryPostHeaderSchema>

export const ZitadelUserHistoryPostPathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelUserHistoryPostPathDto = z.infer<typeof ZitadelUserHistoryPostPathSchema>
