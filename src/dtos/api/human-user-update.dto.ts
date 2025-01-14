import { z } from 'zod'
import { EmailSchema, HashedPasswordSchema, PasswordSchema, PhoneSchema, ProfileSchema } from '.'

export const ZitadelHumanUserUpdateSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  profile: ProfileSchema,
  email: EmailSchema,
  phone: PhoneSchema.optional(),
  password: z.object({
    password: PasswordSchema,
    hashedPassword: HashedPasswordSchema.optional(),
    currentPassword: z.string().optional(),
    verificationCode: z.string().optional(),
  }),
})

export type ZitadelHumanUserUpdateDto = z.infer<typeof ZitadelHumanUserUpdateSchema>

export const ZitadelHumanUserUpdatePathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelHumanUserUpdatePathDto = z.infer<typeof ZitadelHumanUserUpdatePathSchema>
