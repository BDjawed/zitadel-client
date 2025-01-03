import type { ZitadelLoginSettingsUpdateResponse } from './login-settings-update.response'

export interface ZitadelUserPasswordResetCodeCreateResponse extends ZitadelLoginSettingsUpdateResponse {
  verificationCode?: string
}
