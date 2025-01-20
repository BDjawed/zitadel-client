import { z } from 'zod'

export const ZitadelMyUserU2fCheckPostBodySchema = z.object({
  verification: z.object({
    publicKeyCredential: z.string(),
    tokenName: z.string(),
  }),
})
export type ZitadelMyUserU2fCheckPostDto = z.infer<typeof ZitadelMyUserU2fCheckPostBodySchema>
