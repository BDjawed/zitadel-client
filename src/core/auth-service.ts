import fs from 'node:fs'
import { ApiEndpointsV1 } from '../enums'
import { ZitadelClient } from '../zitadel-client'
import type { ZitadelMyUserGrantsPostDto, ZitadelMyUserHistoryPostDto, ZitadelMyUserOrganizationsPostDto, ZitadelMyUserOtpPasswordCheckPostDto, ZitadelMyUserPasskeyVerifyPostDto, ZitadelMyUserU2fCheckPostDto } from '../dtos'
import type { ZitadelClientOptions, ZitadelWellKnown } from '../interfaces'
import type { ZitadelAuthenticationResponse, ZitadelHealthCheckResponse, ZitadelLabelPolicyGetResponse, ZitadelLoginPolicyGetResponse, ZitadelMyUserAuthFactorsGetResponse, ZitadelMyUserAvatarDeleteResponse, ZitadelMyUserDeleteResponse, ZitadelMyUserGetResponse, ZitadelMyUserGrantsPostResponse, ZitadelMyUserHistoryGetResponse, ZitadelMyUserListPermissionsPostResponse, ZitadelMyUserListProjectRolesPostResponse, ZitadelMyUserOrganizationsPostResponse, ZitadelMyUserOtpPasswordCheckPostResponse, ZitadelMyUserOtpPasswordDeleteResponse, ZitadelMyUserOtpPasswordEmailPostResponse, ZitadelMyUserOtpPasswordPostResponse, ZitadelMyUserOtpPasswordSmsPostResponse, ZitadelMyUserPasskeyDeleteResponse, ZitadelMyUserPasskeyGetResponse, ZitadelMyUserPasskeyLinkPostResponse, ZitadelMyUserPasskeyLinkSendPostResponse, ZitadelMyUserPasskeyPostResponse, ZitadelMyUserPasskeyVerifyPostResponse, ZitadelMyUserSessionsGetResponse, ZitadelMyUserU2fCheckPostResponse, ZitadelMyUserU2fDeleteResponse, ZitadelMyUserU2fPostResponse, ZitadelPasswordComplexityPolicyGetResponse, ZitadelUserInfoGetResponse } from '../responses'
import type { HttpClient } from './http-client'

export class AuthService {
  protected wellKnown: ZitadelWellKnown | undefined
  protected authenticationResponse: ZitadelAuthenticationResponse | undefined

  constructor(
    private options: ZitadelClientOptions,
    private httpClient: HttpClient,
  ) { }

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

  async healthCheck(): Promise<ZitadelHealthCheckResponse> {
    const url = `${ApiEndpointsV1.AUTH}/healthz`
    const response: ZitadelHealthCheckResponse = await this.httpClient.client.get(url).json()

    if (Object.keys(response).length === 0) {
      return 'Server is healthy'
    }

    return response
  }

  async getPasswordPolicy(): Promise<ZitadelPasswordComplexityPolicyGetResponse> {
    const url = `${ApiEndpointsV1.AUTH}/policies/passwords/complexity`
    const response: ZitadelPasswordComplexityPolicyGetResponse = await this.httpClient.client.get(url).json()

    return response
  }

  async getLabelPolicy(): Promise<ZitadelLabelPolicyGetResponse> {
    const url = `${ApiEndpointsV1.AUTH}/policies/label`
    const response: ZitadelLabelPolicyGetResponse = await this.httpClient.client.get(url).json()

    return response
  }

  async getPrivacyPolicy(): Promise<string> {
    const url = `${ApiEndpointsV1.AUTH}/policies/privacy`
    const response: string = await this.httpClient.client.get(url).json()

    return response
  }

  async getLoginPolicy(): Promise<ZitadelLoginPolicyGetResponse> {
    const url = `${ApiEndpointsV1.AUTH}/policies/login`
    const response: ZitadelLoginPolicyGetResponse = await this.httpClient.client.get(url).json()

    return response
  }

  async me(): Promise<ZitadelMyUserGetResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me`
    const response: ZitadelMyUserGetResponse = await this.httpClient.client.get(url).json()

    return response
  }

  async deleteMe(): Promise<ZitadelMyUserDeleteResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me`
    const response: ZitadelMyUserDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }

  async myHistory(
    dto: ZitadelMyUserHistoryPostDto,
  ): Promise<ZitadelMyUserHistoryGetResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/changes/_search`
    const response: ZitadelMyUserHistoryGetResponse = await this.httpClient.client.post(
      url,
      {
        json: dto,
      },
    ).json()

    return response
  }

  async mySessions(): Promise<ZitadelMyUserSessionsGetResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/sessions/_search`
    const response: ZitadelMyUserSessionsGetResponse = await this.httpClient.client.post(
      url,
      {
        json: {},
      },
    ).json()

    return response
  }

  async deleteMyAvatar(): Promise<ZitadelMyUserAvatarDeleteResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/avatar`
    const response: ZitadelMyUserAvatarDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }

  async myAuthFactors(): Promise<ZitadelMyUserAuthFactorsGetResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/auth_factors/_search`
    const response: ZitadelMyUserAuthFactorsGetResponse = await this.httpClient.client.post(url).json()

    return response
  }

  async createMyOtpPassword(): Promise<ZitadelMyUserOtpPasswordPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/auth_factors/otp`
    const response: ZitadelMyUserOtpPasswordPostResponse = await this.httpClient.client.post(
      url,
      {
        json: {},
      },
    ).json()

    return response
  }

  async checkMyOtpPassword(
    dto: ZitadelMyUserOtpPasswordCheckPostDto,
  ): Promise<ZitadelMyUserOtpPasswordCheckPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/auth_factors/otp/_verify`
    const response: ZitadelMyUserOtpPasswordCheckPostResponse = await this.httpClient.client.post(
      url,
      {
        json: dto,
      },
    ).json()

    return response
  }

  async deleteMyOtpPassword(): Promise<ZitadelMyUserOtpPasswordDeleteResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/auth_factors/otp`
    const response: ZitadelMyUserOtpPasswordDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }

  async createMyOtpPasswordSms(): Promise<ZitadelMyUserOtpPasswordSmsPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/auth_factors/otp_sms`
    const response: ZitadelMyUserOtpPasswordSmsPostResponse = await this.httpClient.client.post(
      url,
      {
        json: {},
      },
    ).json()

    return response
  }

  async deleteMyOtpPasswordSms(): Promise<ZitadelMyUserOtpPasswordDeleteResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/auth_factors/otp_sms`
    const response: ZitadelMyUserOtpPasswordDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }

  async deleteMyOtpPasswordEmail(): Promise<ZitadelMyUserOtpPasswordDeleteResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/auth_factors/otp_email`
    const response: ZitadelMyUserOtpPasswordDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }

  async createMyOtpPasswordEmail(): Promise<ZitadelMyUserOtpPasswordEmailPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/auth_factors/otp_email`
    const response: ZitadelMyUserOtpPasswordEmailPostResponse = await this.httpClient.client.post(
      url,
      {
        json: {},
      },
    ).json()

    return response
  }

  async createMyU2f(): Promise<ZitadelMyUserU2fPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/auth_factors/u2f`
    const response: ZitadelMyUserU2fPostResponse = await this.httpClient.client.post(
      url,
      {
        json: {},
      },
    ).json()

    return response
  }

  async checkMyU2fToken(
    dto: ZitadelMyUserU2fCheckPostDto,
  ): Promise<ZitadelMyUserU2fCheckPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/auth_factors/u2f/_verify`
    const response: ZitadelMyUserU2fCheckPostResponse = await this.httpClient.client.post(
      url,
      {
        json: dto,
      },
    ).json()

    return response
  }

  async deleteMyU2fToken(tokenId: string): Promise<ZitadelMyUserU2fDeleteResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/auth_factors/u2f/${tokenId}`
    const response: ZitadelMyUserU2fDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }

  async listMyPasskeys(): Promise<ZitadelMyUserPasskeyGetResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/passwordless/_search`
    const response: ZitadelMyUserPasskeyGetResponse = await this.httpClient.client.post(url).json()

    return response
  }

  async createMyPasskey(): Promise<ZitadelMyUserPasskeyPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/passwordless`
    const response: ZitadelMyUserPasskeyPostResponse = await this.httpClient.client.post(
      url,
      {
        json: {},
      },
    ).json()

    return response
  }

  async createMyPasskeyLink(): Promise<ZitadelMyUserPasskeyLinkPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/passwordless/_link`
    const response: ZitadelMyUserPasskeyLinkPostResponse = await this.httpClient.client.post(
      url,
      {
        json: {},
      },
    ).json()

    return response
  }

  async sendMyPasskeyLink(): Promise<ZitadelMyUserPasskeyLinkSendPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/passwordless/_link/_send`
    const response: ZitadelMyUserPasskeyLinkSendPostResponse = await this.httpClient.client.post(
      url,
      {
        json: {},
      },
    ).json()

    return response
  }

  async verifyMyPasskey(
    dto: ZitadelMyUserPasskeyVerifyPostDto,
  ): Promise<ZitadelMyUserPasskeyVerifyPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/passwordless/_verify`
    const response: ZitadelMyUserPasskeyVerifyPostResponse = await this.httpClient.client.post(
      url,
      {
        json: dto,
      },
    ).json()

    return response
  }

  async deleteMyPasskey(
    tokenId: string,
  ): Promise<ZitadelMyUserPasskeyDeleteResponse> {
    const url = `${ApiEndpointsV1.AUTH}/users/me/passwordless/${tokenId}`
    const response: ZitadelMyUserPasskeyDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }

  async listMyUserGrants(
    dto: ZitadelMyUserGrantsPostDto,
  ): Promise<ZitadelMyUserGrantsPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/usergrants/me/_search`
    const response: ZitadelMyUserGrantsPostResponse = await this.httpClient.client.post(
      url,
      {
        json: dto,
      },
    ).json()

    return response
  }

  async listMyOrganizations(
    dto: ZitadelMyUserOrganizationsPostDto,
  ): Promise<ZitadelMyUserOrganizationsPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/global/projectorgs/_search`
    const response: ZitadelMyUserOrganizationsPostResponse = await this.httpClient.client.post(
      url,
      {
        json: dto,
      },
    ).json()

    return response
  }

  async listMyPermissions(): Promise<ZitadelMyUserListPermissionsPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/permissions/zitadel/me/_search`
    const response: ZitadelMyUserListPermissionsPostResponse = await this.httpClient.client.post(url).json()

    return response
  }

  async listMyProjectRoles(): Promise<ZitadelMyUserListProjectRolesPostResponse> {
    const url = `${ApiEndpointsV1.AUTH}/permissions/me/_search`
    const response: ZitadelMyUserListProjectRolesPostResponse = await this.httpClient.client.post(url).json()

    return response
  }

  // todo: https://zitadel.com/docs/apis/resources/auth/auth-service-get-my-email
}
