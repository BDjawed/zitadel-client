import { z } from 'zod'

export const ZitadelUserAuthenticationMethodsPathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelUserAuthenticationMethodsPathDto = z.infer<typeof ZitadelUserAuthenticationMethodsPathSchema>

export const ZitadelUserAuthenticationMethodsGetQuerySchema = z.object({
  includeWithoutDomain: z.boolean().optional(),
  domain: z.string().optional(),
})

export type ZitadelUserAuthenticationMethodsGetQueryDto = z.infer<typeof ZitadelUserAuthenticationMethodsGetQuerySchema>
