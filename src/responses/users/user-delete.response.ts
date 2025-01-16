import type { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from '../login/login-settings-update.response'

export const ZitadelUserDeleteResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({})

export type ZitadelUserDeleteResponse = z.infer<typeof ZitadelUserDeleteResponseSchema>
