import type { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '.'

export const ZitadelUserDeletePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserDeletePathDto = z.infer<typeof ZitadelUserDeletePathSchema>
