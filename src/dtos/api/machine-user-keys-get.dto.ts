import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from './common'

export const ZitadelMachineUserKeysGetHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserKeysGetHeaderDto = z.infer<typeof ZitadelMachineUserKeysGetHeaderSchema>

export const ZitadelMachineUserKeysGetPathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelMachineUserKeysGetPathDto = z.infer<typeof ZitadelMachineUserKeysGetPathSchema>

export const QuerySchema = z.object({
  offset: z.string(),
  limit: z.number().int(),
  asc: z.boolean(),
})

export type Query = z.infer<typeof QuerySchema>

export const ZitadelMachineUserKeysGetSchema = z.object({
  query: QuerySchema,
})

export type ZitadelMachineUserKeysGetDto = z.infer<typeof ZitadelMachineUserKeysGetSchema>
