import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from './common'

export const ZitadelUserExistingCheckGetSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  email: z.string().min(1, 'Email is required'),
})

export type ZitadelUserExistingCheckGetDto = z.infer<typeof ZitadelUserExistingCheckGetSchema>

export const ZitadelUserExistingCheckByUserNameOrEmailSchema = z.union([
  z.object({
    userName: z.string().min(1, 'Username is required'),
    email: z.undefined(),
  }),
  z.object({
    userName: z.undefined(),
    email: z.string().min(1, 'Email is required'),
  }),
])

export type ZitadelUserExistingCheckByUserNameOrEmailDto = z.infer<typeof ZitadelUserExistingCheckByUserNameOrEmailSchema>

export const ZitadelUserExistingCheckGetHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelUserExistingCheckGetHeaderDto = z.infer<typeof ZitadelUserExistingCheckGetHeaderSchema>
