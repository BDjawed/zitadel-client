import type { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from './login-settings-update.response'

export const ZitadelUserTotpDeleteResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({})

export type ZitadelUserTotpDeleteResponse = z.infer<typeof ZitadelUserTotpDeleteResponseSchema>
