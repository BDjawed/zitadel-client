import type { ZitadelLoginSettingsUpdateResponse } from './login-settings-update.response'

export interface ZitadelUserPasskeyRegisterGetResponse extends ZitadelLoginSettingsUpdateResponse {
  passkeyId: string
  publicKeyCredentialCreationOptions: object
}
