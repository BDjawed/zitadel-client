import fs from 'node:fs'
import { ZitadelClient } from '../zitadel-client'
import type { ZitadelClientOptions, ZitadelWellKnown } from '../interfaces'
import type { ZitadelAuthenticationResponse, ZitadelUserInfoGetResponse } from '../responses'
import type { HttpClient } from './http-client'

export class AuthService {
  protected wellKnown: ZitadelWellKnown | undefined
  protected authenticationResponse: ZitadelAuthenticationResponse | undefined

  constructor(
    private options: ZitadelClientOptions,
    private httpClient: HttpClient,
  ) {}

  async setup(): Promise<void> {
    await this.fetchWellKnown()
    await this.authenticateServiceUser()
  }

  private async fetchWellKnown(): Promise<void> {
    this.wellKnown = await this.httpClient.client.get('.well-known/openid-configuration').json()
  }

  private generateJwtAssertion(): string {
    const keyFileContent = JSON.parse(fs.readFileSync(this.options.privateJwtKeyPath, 'utf-8'))
    return ZitadelClient.generateJwtAssertion({
      issuer: keyFileContent.userId,
      subject: keyFileContent.userId,
      audience: this.options.issuerUrl,
      keyId: keyFileContent.keyId,
      key: keyFileContent.key,
    })
  }

  private async authenticateServiceUser(): Promise<void> {
    const assertion = this.generateJwtAssertion()
    const grantType = 'urn:ietf:params:oauth:grant-type:jwt-bearer'
    const scope = 'openid urn:zitadel:iam:org:project:id:zitadel:aud'

    if (!this.wellKnown) {
      throw new Error('wellKnown is not defined')
    }

    const response: ZitadelAuthenticationResponse = await this.httpClient.pureClient.post(this.wellKnown.token_endpoint, {
      searchParams: {
        grant_type: grantType,
        assertion,
        scope,
      },
    }).json()

    this.authenticationResponse = response
    this.httpClient.updateAuthToken(response.access_token)
  }

  getAuthenticationResponse(): ZitadelAuthenticationResponse {
    if (!this.authenticationResponse) {
      throw new Error('authenticationResponse is not defined')
    }
    return this.authenticationResponse
  }

  getWellKnown(): ZitadelWellKnown {
    if (!this.wellKnown) {
      throw new Error('wellKnown is not defined')
    }
    return this.wellKnown
  }

  async getUserInfo(): Promise<ZitadelUserInfoGetResponse> {
    if (!this.wellKnown) {
      throw new Error('wellKnown is not defined')
    }
    return this.httpClient.pureClient.get(this.wellKnown.userinfo_endpoint).json()
  }
}
