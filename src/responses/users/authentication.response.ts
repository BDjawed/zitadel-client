import { z } from 'zod'

export const ZitadelAuthenticationResponseSchema = z.object({
  access_token: z.string().min(1, 'Access token is required'),
  token_type: z.string().min(1, 'Token type is required'),
  expires_in: z.number().min(1, 'Expires in is required'),
  id_token: z.string().min(1, 'ID token is required'),
})

export type ZitadelAuthenticationResponse = z.infer<typeof ZitadelAuthenticationResponseSchema>
