import type { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from '../login/login-settings-update.response'

export const ZitadelUserPhoneDeleteResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({})

export type ZitadelUserPhoneDeleteResponse = z.infer<typeof ZitadelUserPhoneDeleteResponseSchema>
