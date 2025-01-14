import { z } from 'zod'

export const ZitadelUserExistingCheckGetResponseSchema = z.object({
  isUnique: z.boolean(),
})

export type ZitadelUserExistingCheckGetResponse = z.infer<typeof ZitadelUserExistingCheckGetResponseSchema>
