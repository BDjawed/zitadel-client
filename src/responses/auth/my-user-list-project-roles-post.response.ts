import { z } from 'zod'

export const ZitadelMyUserListProjectRolesPostResponseSchema = z.object({
  result: z.array(z.string()),
})

export type ZitadelMyUserListProjectRolesPostResponse = z.infer<typeof ZitadelMyUserListProjectRolesPostResponseSchema>
