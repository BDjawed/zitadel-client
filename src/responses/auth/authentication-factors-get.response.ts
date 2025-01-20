import { z } from 'zod'
import { AuthFactorState } from '..'

export const ZitadelAuthFactorsResultSchema = z.object({
  state: z.nativeEnum(AuthFactorState),
  otp: z.object({}),
  u2f: z.object({
    id: z.string(),
    name: z.string(),
  }),
  otpSms: z.object({}),
  otpEmail: z.object({}),
})

export const ZitadelMyUserAuthFactorsGetResponseSchema = z.object({
  result: z.array(ZitadelAuthFactorsResultSchema),
})

export type ZitadelMyUserAuthFactorsGetResponse = z.infer<typeof ZitadelMyUserAuthFactorsGetResponseSchema>
