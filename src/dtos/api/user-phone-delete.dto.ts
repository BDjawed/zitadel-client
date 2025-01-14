import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '.'

export const ZitadelUserPhoneDeletePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserPhoneDeletePathDto = z.infer<typeof ZitadelUserPhoneDeletePathSchema>

export const ZitadelUserPhoneDeleteSchema = z.object({})

export type ZitadelUserPhoneDeleteDto = z.infer<typeof ZitadelUserPhoneDeleteSchema>
