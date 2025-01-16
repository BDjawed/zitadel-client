import { z } from 'zod'

const CodeSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  code: z.string().min(1, 'Code is required'),
})

const DetailsSchema = z.object({
  sequence: z.string(),
  changeDate: z.string().optional(),
  creationDate: z.string().optional(),
  resourceOwner: z.string(),
})

export const ZitadelUserPasskeyLinkRegistrationPostResponseSchema = z.object({
  details: DetailsSchema,
  code: CodeSchema,
})

export type ZitadelUserPasskeyLinkRegistrationPostResponse = z.infer<typeof ZitadelUserPasskeyLinkRegistrationPostResponseSchema>
