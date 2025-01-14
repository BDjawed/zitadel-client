import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '.'

export const ZitadelUserPhoneCreateSchema = z.object({
  phone: z.string().min(1, 'Phone is required'),
  sendCode: z.object({}).optional(),
  returnCode: z.object({}).optional(),
  isVerified: z.boolean().optional(),
})

export type ZitadelUserPhoneCreateDto = z.infer<typeof ZitadelUserPhoneCreateSchema>

export const ZitadelUserPhoneCreatePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserPhoneCreatePathDto = z.infer<typeof ZitadelUserPhoneCreatePathSchema>
