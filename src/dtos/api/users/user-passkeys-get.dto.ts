import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '..'

export const ZitadelUserPasskeysGetPathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserPasskeysGetPathDto = z.infer<typeof ZitadelUserPasskeysGetPathSchema>

export const ZitadelUserPasskeysGetSchema = z.object({})

export type ZitadelUserPasskeysGetDto = z.infer<typeof ZitadelUserPasskeysGetSchema>
