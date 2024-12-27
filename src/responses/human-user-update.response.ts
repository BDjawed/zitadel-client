import type { ZitadelLoginSettingsUpdateResponse } from '.'

export interface ZitadelHumanUserUpdateResponse extends ZitadelLoginSettingsUpdateResponse {
  emailCode: string
  phoneCode: string
}
