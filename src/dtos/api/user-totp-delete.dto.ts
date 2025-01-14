import type { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '.'

export const ZitadelUserTotpDeletePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserTotpDeletePathDto = z.infer<typeof ZitadelUserTotpDeletePathSchema>
