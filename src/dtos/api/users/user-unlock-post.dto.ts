import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '..'

export const ZitadelUserUnlockPathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserUnlockPathDto = z.infer<typeof ZitadelUserUnlockPathSchema>

export const ZitadelUserUnlockPostSchema = z.object({})

export type ZitadelUserUnlockPostDto = z.infer<typeof ZitadelUserUnlockPostSchema>
