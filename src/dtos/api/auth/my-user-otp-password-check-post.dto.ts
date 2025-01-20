import { z } from 'zod'

export const ZitadelMyUserOtpPasswordCheckPostBodySchema = z.object({
  code: z.string(),
})
export type ZitadelMyUserOtpPasswordCheckPostDto = z.infer<typeof ZitadelMyUserOtpPasswordCheckPostBodySchema>
