import type { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from '../login/login-settings-update.response'

export const ZitadelUserOtpEmailDeleteResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({})

export type ZitadelUserOtpEmailDeleteResponse = z.infer<typeof ZitadelUserOtpEmailDeleteResponseSchema>
