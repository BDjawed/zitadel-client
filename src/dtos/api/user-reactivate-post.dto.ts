import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '.'

export const ZitadelUserReactivatePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserReactivatePathDto = z.infer<typeof ZitadelUserReactivatePathSchema>

export const ZitadelUserReactivatePostSchema = z.object({})

export type ZitadelUserReactivatePostDto = z.infer<typeof ZitadelUserReactivatePostSchema>
