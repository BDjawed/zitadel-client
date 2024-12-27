import type { Code } from '..'
import type { ZitadelLoginSettingsUpdateResponse } from './login-settings-update.response'

export interface ZitadelUserPasskeyLinkRegistrationPostResponse extends ZitadelLoginSettingsUpdateResponse {
  code: Code
}
