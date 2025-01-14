import { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from './login-settings-update.response'

export const ZitadelUserPasswordResetCodeCreateResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({
  verificationCode: z.string().optional(),
})

export type ZitadelUserPasswordResetCodeCreateResponse = z.infer<typeof ZitadelUserPasswordResetCodeCreateResponseSchema>
