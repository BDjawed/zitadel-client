import { z } from 'zod'

export const ZitadelUserByIdGetPathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelUserByIdGetPathDto = z.infer<typeof ZitadelUserByIdGetPathSchema>
