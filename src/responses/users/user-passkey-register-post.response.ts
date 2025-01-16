import { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from '../login/login-settings-update.response'

export const ZitadelUserPasskeyRegisterPostResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({
  passkeyId: z.string(),
  publicKeyCredentialCreationOptions: z.object({}),
})

export type ZitadelUserPasskeyRegisterPostResponse = z.infer<typeof ZitadelUserPasskeyRegisterPostResponseSchema>
