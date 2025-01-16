import { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from '../login/login-settings-update.response'

export const ZitadelUserPhoneCreateResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({
  verificationCode: z.string().optional(),
})

export type ZitadelUserPhoneCreateResponse = z.infer<typeof ZitadelUserPhoneCreateResponseSchema>
