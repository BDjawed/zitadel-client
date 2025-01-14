import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from './common'

export const ZitadelUserAvatarDeletePathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelUserAvatarDeletePathDto = z.infer<typeof ZitadelUserAvatarDeletePathSchema>

export const ZitadelUserAvatarDeleteHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelUserAvatarDeleteHeaderDto = z.infer<typeof ZitadelUserAvatarDeleteHeaderSchema>
