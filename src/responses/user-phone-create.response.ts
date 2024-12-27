import type { ZitadelLoginSettingsUpdateResponse } from './login-settings-update.response'

export interface ZitadelUserPhoneCreateResponse extends ZitadelLoginSettingsUpdateResponse {
  verificationCode?: string
}
