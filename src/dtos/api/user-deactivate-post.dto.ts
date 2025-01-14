import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '.'

export const ZitadelUserDeactivatePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserDeactivatePathDto = z.infer<typeof ZitadelUserDeactivatePathSchema>

export const ZitadelUserDeactivatePostSchema = z.object({})

export type ZitadelUserDeactivatePostDto = z.infer<typeof ZitadelUserDeactivatePostSchema>
