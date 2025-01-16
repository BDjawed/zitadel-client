import type { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '..'

export const ZitadelUserOtpSmsDeletePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserOtpSmsDeletePathDto = z.infer<typeof ZitadelUserOtpSmsDeletePathSchema>
