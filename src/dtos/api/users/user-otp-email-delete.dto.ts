import type { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '..'

export const ZitadelUserOtpEmailDeletePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserOtpEmailDeletePathDto = z.infer<typeof ZitadelUserOtpEmailDeletePathSchema>
