import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '.'

export const ZitadelUserEmailCreatePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserEmailCreatePathDto = z.infer<typeof ZitadelUserEmailCreatePathSchema>

export const ZitadelUserEmailCreatePostSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  sendCode: z.object({
    urlTemplate: z.string().min(1, 'URL template is required'),
  }).optional(),
  returnCode: z.object({}).optional(),
  isVerified: z.boolean().optional(),
})

export type ZitadelUserEmailCreatePostDto = z.infer<typeof ZitadelUserEmailCreatePostSchema>
