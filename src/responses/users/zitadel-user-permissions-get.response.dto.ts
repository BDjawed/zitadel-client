import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ResultSchema = z.object({
  userId: z.string(),
  details: DetailsSchema,
  roles: z.array(z.string()),
  displayName: z.string(),
  iam: z.boolean(),
  orgId: z.string(),
  projectId: z.string(),
  projectGrantId: z.string(),
})

export const ZitadelUserPermissionsGetResponseSchema = z.object({
  details: DetailsSchema,
  result: z.array(ResultSchema),
})

export type Result = z.infer<typeof ResultSchema>
export type ZitadelUserPermissionsGetResponseDto = z.infer<typeof ZitadelUserPermissionsGetResponseSchema>
