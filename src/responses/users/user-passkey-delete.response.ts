import type { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from '../login/login-settings-update.response'

export const ZitadelUserPasskeyDeleteResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({})

export type ZitadelUserPasskeyDeleteResponse = z.infer<typeof ZitadelUserPasskeyDeleteResponseSchema>
