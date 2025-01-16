import { z } from 'zod'
import { EmailSchema, HashedPasswordSchema, IdpLinkSchema, MetadataSchema, OrganizationSchema, PasswordSchema, PhoneSchema, ProfileSchema } from '../../common'

export const ZitadelHumanUserCreateSchema = z.object({
  userId: z.string().optional(),
  username: z.string().optional(),
  organization: OrganizationSchema.optional(),
  profile: ProfileSchema,
  email: EmailSchema,
  phone: PhoneSchema.optional(),
  metadata: z.array(MetadataSchema).optional(),
  password: PasswordSchema.optional(),
  hashedPassword: HashedPasswordSchema.optional(),
  idpLinks: z.array(IdpLinkSchema).optional(),
  totpSecret: z.string().optional(),
})

export type ZitadelHumanUserCreateDto = z.infer<typeof ZitadelHumanUserCreateSchema>
