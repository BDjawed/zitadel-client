import type { ZitadelLoginSettingsUpdateResponse } from './login-settings-update.response'

export interface ZitadelUserPasskeyRegisterPostResponse extends ZitadelLoginSettingsUpdateResponse {
  passkeyId: string
  publicKeyCredentialCreationOptions: object
}
