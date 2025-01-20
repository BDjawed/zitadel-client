import { z } from 'zod'

export const ZitadelMyUserListPermissionsPostResponseSchema = z.object({
  result: z.array(z.string()),
})

export type ZitadelMyUserListPermissionsPostResponse = z.infer<typeof ZitadelMyUserListPermissionsPostResponseSchema>
