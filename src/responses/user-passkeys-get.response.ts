import type { ZitadelLoginSettingsUpdateResponse } from './login-settings-update.response'

export interface ZitadelUserPasskeysGetResponse extends ZitadelLoginSettingsUpdateResponse {
  result: Result[]
}

interface Result {
  id: string
  state: AuthFactorState
  name: string
}

export enum AuthFactorState {
  UNSPECIFIED = 'AUTH_FACTOR_STATE_UNSPECIFIED',
  NOT_READY = 'AUTH_FACTOR_STATE_NOT_READY',
  READY = 'AUTH_FACTOR_STATE_READY',
  REMOVED = 'AUTH_FACTOR_STATE_REMOVED',
}
