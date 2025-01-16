import { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from '../login/login-settings-update.response'

export enum AuthFactorState {
  UNSPECIFIED = 'AUTH_FACTOR_STATE_UNSPECIFIED',
  NOT_READY = 'AUTH_FACTOR_STATE_NOT_READY',
  READY = 'AUTH_FACTOR_STATE_READY',
  REMOVED = 'AUTH_FACTOR_STATE_REMOVED',
}

const ResultSchema = z.object({
  id: z.string(),
  state: z.nativeEnum(AuthFactorState),
  name: z.string(),
})

export const ZitadelUserPasskeysGetResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({
  result: z.array(ResultSchema),
})

// type Result = z.infer<typeof ResultSchema>
export type ZitadelUserPasskeysGetResponse = z.infer<typeof ZitadelUserPasskeysGetResponseSchema>
