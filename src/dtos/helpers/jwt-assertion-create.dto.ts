import { z } from 'zod'

export const ZitadelJwtAssertionCreateSchema = z.object({
  issuer: z.string().min(1, 'Issuer is required'),
  subject: z.string().min(1, 'Subject is required'),
  audience: z.string().min(1, 'Audience is required'),
  keyId: z.string().min(1, 'Key ID is required'),
  key: z.string().min(1, 'Key is required'),
})

export type ZitadelJwtAssertionCreateDto = z.infer<typeof ZitadelJwtAssertionCreateSchema>
