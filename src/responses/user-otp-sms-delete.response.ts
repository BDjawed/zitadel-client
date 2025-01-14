import type { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from './login-settings-update.response'

export const ZitadelUserOtpSmsDeleteResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({})

export type ZitadelUserOtpSmsDeleteResponse = z.infer<typeof ZitadelUserOtpSmsDeleteResponseSchema>
