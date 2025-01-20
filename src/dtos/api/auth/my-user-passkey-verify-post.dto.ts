import { z } from 'zod'

export const ZitadelMyUserPasskeyVerifyPostBodySchema = z.object({
  verification: z.object({
    publicKeyCredential: z.string(),
    tokenName: z.string(),
  }),
})
export type ZitadelMyUserPasskeyVerifyPostDto = z.infer<typeof ZitadelMyUserPasskeyVerifyPostBodySchema>
