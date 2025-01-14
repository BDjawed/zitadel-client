import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '.'

export const NewPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  changeRequired: z.boolean().optional(),
})

export type NewPassword = z.infer<typeof NewPasswordSchema>

export const ZitadelUserPasswordCreateSchema = z.object({
  newPassword: NewPasswordSchema,
  currentPassword: z.string().optional(),
  verificationCode: z.string().optional(),
})

export type ZitadelUserPasswordCreateDto = z.infer<typeof ZitadelUserPasswordCreateSchema>

export const ZitadelUserPasswordCreatePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserPasswordCreatePathDto = z.infer<typeof ZitadelUserPasswordCreatePathSchema>
