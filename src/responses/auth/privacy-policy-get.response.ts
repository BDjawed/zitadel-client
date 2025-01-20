import { z } from 'zod'
import { DetailsSchema } from '../common'

export const ZitadelPrivacyPolicyResponseSchema = z.object({
  policy: z.object({
    detail: DetailsSchema,
    tosLink: z.string(),
    privacyLink: z.string(),
    isDefault: z.boolean(),
    helpLink: z.string(),
    supportEmail: z.string(),
    docsLink: z.string(),
    customLink: z.string(),
    customLinkText: z.string(),
  }),
})

export type ZitadelPrivacyPolicyGetResponse = z.infer<typeof ZitadelPrivacyPolicyResponseSchema>
