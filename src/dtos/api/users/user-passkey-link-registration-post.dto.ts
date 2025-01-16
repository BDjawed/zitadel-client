import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '..'

export const ZitadelUserPasskeyLinkRegistrationPostPathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserPasskeyLinkRegistrationPostPathDto = z.infer<typeof ZitadelUserPasskeyLinkRegistrationPostPathSchema>

export const ZitadelUserPasskeyLinkRegistrationPostSchema = z.object({
  sendLink: z.object({
    urlTemplate: z.string().min(1, 'URL template is required'),
  }).optional(),
  returnCode: z.object({}).optional(),
})

export type ZitadelUserPasskeyLinkRegistrationPostDto = z.infer<typeof ZitadelUserPasskeyLinkRegistrationPostSchema>
