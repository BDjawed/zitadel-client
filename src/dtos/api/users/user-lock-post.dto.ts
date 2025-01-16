import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '..'

export const ZitadelUserLockPathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserLockPathDto = z.infer<typeof ZitadelUserLockPathSchema>

export const ZitadelUserLockPostSchema = z.object({})

export type ZitadelUserLockPostDto = z.infer<typeof ZitadelUserLockPostSchema>
