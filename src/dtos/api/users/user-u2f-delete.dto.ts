import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '..'

export const ZitadelUserU2fDeletePathSchema = ZitadelUserByIdGetPathSchema.extend({
  u2fId: z.string().min(1, 'U2F ID is required'),
})

export type ZitadelUserU2fDeletePathDto = z.infer<typeof ZitadelUserU2fDeletePathSchema>
