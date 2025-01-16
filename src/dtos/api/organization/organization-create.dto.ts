import { z } from 'zod'
import { EmailSchema, HashedPasswordSchema, IdpLinkSchema, MetadataSchema, PasswordSchema, PhoneSchema, ProfileSchema } from '../common'

export const ZitadelOrganizationCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  admins: z.array(z.object({
    userId: z.string().optional(),
    human: z.object({
      userId: z.string().optional(),
      username: z.string().optional(),
      organization: z.object({
        orgId: z.string().optional(),
        orgDomain: z.string().optional(),
      }).optional(),
      profile: ProfileSchema,
      email: EmailSchema,
      phone: PhoneSchema.optional(),
      metadata: MetadataSchema.optional(),
      password: PasswordSchema.optional(),
      hashedPassword: HashedPasswordSchema.optional(),
      idpLinks: z.array(IdpLinkSchema).optional(),
      totpSecret: z.string().optional(),
    }).optional(),
    roles: z.array(z.string()).optional(),
  })).optional(),
})

export type ZitadelOrganizationCreateDto = z.infer<typeof ZitadelOrganizationCreateSchema>
