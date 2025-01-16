import { z } from 'zod'

export const ZitadelUserByLoginNameGetPathSchema = z.object({
  loginName: z.string().min(1, 'Login name is required'),
})

export type ZitadelUserByLoginNameGetPathDto = z.infer<typeof ZitadelUserByLoginNameGetPathSchema>
