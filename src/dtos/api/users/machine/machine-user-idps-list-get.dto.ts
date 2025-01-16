import { z } from 'zod'

export const ZitadelMachineUserIdpsListGetPathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelMachineUserIdpsListGetPathDto = z.infer<typeof ZitadelMachineUserIdpsListGetPathSchema>

const QuerySchema = z.object({
  offset: z.string(),
  limit: z.number().int(),
  asc: z.boolean(),
})

export const ZitadelMachineUserIdpsListGetSchema = z.object({
  query: QuerySchema,
})

export type ZitadelMachineUserIdpsListGetDto = z.infer<typeof ZitadelMachineUserIdpsListGetSchema>
