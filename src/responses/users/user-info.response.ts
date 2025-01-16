import { z } from 'zod'

export const ZitadelUserInfoGetResponseSchema = z.object({
  sub: z.string(),
})

export type ZitadelUserInfoGetResponse = z.infer<typeof ZitadelUserInfoGetResponseSchema>
