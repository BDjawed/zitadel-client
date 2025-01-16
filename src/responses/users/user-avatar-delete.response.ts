import type { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from '..'

export const ZitadelUserAvatarDeleteResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({})

export type ZitadelUserAvatarDeleteResponse = z.infer<typeof ZitadelUserAvatarDeleteResponseSchema>
