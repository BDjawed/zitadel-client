import type { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from '../login/login-settings-update.response'

export const ZitadelUserPasswordCreateResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({})

export type ZitadelUserPasswordCreateResponse = z.infer<typeof ZitadelUserPasswordCreateResponseSchema>
