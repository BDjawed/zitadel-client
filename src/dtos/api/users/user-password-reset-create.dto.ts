import { z } from 'zod'
import { ZitadelUserByIdGetPathSchema } from '..'

export enum NotificationType {
  UNSPECIFIED = 'NOTIFICATION_TYPE_Unspecified',
  EMAIL = 'NOTIFICATION_TYPE_EMAIL',
  SMS = 'NOTIFICATION_TYPE_SMS',
}

export const SendLinkSchema = z.object({
  notificationType: z.nativeEnum(NotificationType),
  urlTemplate: z.string().optional(),
})

export type SendLink = z.infer<typeof SendLinkSchema>

export const ZitadelUserPasswordResetCodeCreateSchema = z.object({
  sendLink: SendLinkSchema.optional(),
  returnCode: z.object({}).optional(),
})

export type ZitadelUserPasswordResetCodeCreateDto = z.infer<typeof ZitadelUserPasswordResetCodeCreateSchema>

export const ZitadelUserPasswordResetCodeCreatePathSchema = ZitadelUserByIdGetPathSchema.extend({})

export type ZitadelUserPasswordResetCodeCreatePathDto = z.infer<typeof ZitadelUserPasswordResetCodeCreatePathSchema>
