import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelPasswordComplexityPolicyResponseSchema = z.object({
  policy: z.object({
    detail: DetailsSchema,
    minLength: z.string().optional(),
    hasUppercase: z.boolean().optional(),
    hasLowercase: z.boolean().optional(),
    hasNumber: z.boolean().optional(),
    hasSymbol: z.boolean().optional(),
    isDefault: z.boolean().optional(),
  }),
})

export type ZitadelPasswordComplexityPolicyGetResponse = z.infer<typeof ZitadelPasswordComplexityPolicyResponseSchema>
