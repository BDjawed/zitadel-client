import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import jwt from 'jsonwebtoken'
import ky from 'ky'
import type { HTTPError, KyInstance } from 'ky'

import { ApiEndpointsV1, ApiEndpointsV2, UsersEndpointsV1 } from './enums'

import { extendedErrorInterceptor } from './interceptors'

import type {
  ZitadelAppApiCreateDto,
  ZitadelAppApiDeletePathDto,
  ZitadelAppClientSecretCreatePathDto,
  ZitadelAppOidcCreateDto,
  ZitadelHumanUserCreateDto,
  ZitadelHumanUserUpdateDto,
  ZitadelJwtAssertionCreateDto,
  ZitadelLoginSettingsUpdateDto,
  ZitadelMachineUserCreateDto,
  ZitadelMachineUserIdpsListGetDto,
  ZitadelMachineUserKeyByIdGetPathDto,
  ZitadelMachineUserKeyCreateDto,
  ZitadelMachineUserKeyDeletePathDto,
  ZitadelMachineUserKeysGetDto,
  ZitadelMachineUserPatCreateDto,
  ZitadelMachineUserPatDeletePathDto,
  ZitadelMachineUserPatGetPathDto,
  ZitadelMachineUserPatsListGetDto,
  ZitadelMachineUserUpdateDto,
  ZitadelOrganizationCreateDto,
  ZitadelProjectCreateDto,
  ZitadelUserAuthenticationMethodsGetQueryDto,
  ZitadelUserEmailCreatePostDto,
  ZitadelUserExistingCheckByUserNameOrEmailDto,
  ZitadelUserHistoryPostDto,
  ZitadelUserMetadataByKeyBulkCreateDto,
  ZitadelUserMetadataByKeyBulkDeleteDto,
  ZitadelUserMetadataByKeyCreateDto,
  ZitadelUserMetadataByKeyCreatePathDto,
  ZitadelUserMetadataByKeyPathDeleteDto,
  ZitadelUserMetadataByKeyPathGetDto,
  ZitadelUserMetadataSearchDto,
  ZitadelUserPasskeyDeletePathDto,
  ZitadelUserPasskeyLinkRegistrationPostDto,
  ZitadelUserPasskeyRegisterPostDto,
  ZitadelUserPasskeysGetDto,
  ZitadelUserPasswordCreateDto,
  ZitadelUserPasswordResetCodeCreateDto,
  ZitadelUserPermissionsGetDto,
  ZitadelUserPhoneCreateDto,
  ZitadelUserResendVerifyCodeByEmailPostDto,
  ZitadelUserResendVerifyCodeByPhonePostDto,
  ZitadelUsersSearchDto,
  ZitadelUserU2fDeletePathDto,
} from './dtos'

import type { ZitadelClientOptions, ZitadelWellKnown } from './interfaces'
import type {
  ZitadelAppApiCreateResponse,
  ZitadelAppApiDeleteResponse,
  ZitadelAppClientSecretCreateResponse,
  ZitadelAppOidcCreateResponse,
  ZitadelAuthenticationResponse,
  ZitadelHumanUserCreateResponse,
  ZitadelHumanUserUpdateResponse,
  ZitadelLoginSettingsGetResponse,
  ZitadelLoginSettingsUpdateResponse,
  ZitadelMachineUserCreateResponse,
  ZitadelMachineUserIdpsListGetResponse,
  ZitadelMachineUserKeyByIdGetResponse,
  ZitadelMachineUserKeyCreateResponse,
  ZitadelMachineUserKeyDeleteResponse,
  ZitadelMachineUserKeysGetResponse,
  ZitadelMachineUserPatCreateResponse,
  ZitadelMachineUserPatDeleteResponse,
  ZitadelMachineUserPatGetResponse,
  ZitadelMachineUserPatsListGetResponse,
  ZitadelMachineUserSecretCreateResponse,
  ZitadelMachineUserSecretDeleteResponse,
  ZitadelMachineUserUpdateResponse,
  ZitadelOrganizationCreateResponse,
  ZitadelOrganizationDeleteResponse,
  ZitadelProjectCreateResponse,
  ZitadelUserAuthenticationMethodsGetResponse,
  ZitadelUserAvatarDeleteResponse,
  ZitadelUserByIdGetResponse,
  ZitadelUserByLoginNameGetResponse,
  ZitadelUserDeactivatePostResponse,
  ZitadelUserDeleteResponse,
  ZitadelUserEmailCreateResponse,
  ZitadelUserExistingCheckGetResponse,
  ZitadelUserHistoryPostResponse,
  ZitadelUserInfoGetResponse,
  ZitadelUserLockPostResponse,
  ZitadelUserMetadataByKeyBulkCreateResponse,
  ZitadelUserMetadataByKeyBulkDeleteResponse,
  ZitadelUserMetadataByKeyCreateResponse,
  ZitadelUserMetadataByKeyDeleteResponse,
  ZitadelUserMetadataByKeyGetResponse,
  ZitadelUserMetadataSearchGetResponse,
  ZitadelUserOtpEmailDeleteResponse,
  ZitadelUserOtpSmsDeleteResponse,
  ZitadelUserPasskeyDeleteResponse,
  ZitadelUserPasskeyLinkRegistrationPostResponse,
  ZitadelUserPasskeyRegisterPostResponse,
  ZitadelUserPasskeysGetResponse,
  ZitadelUserPasswordCreateResponse,
  ZitadelUserPasswordResetCodeCreateResponse,
  ZitadelUserPermissionsGetResponseDto,
  ZitadelUserPhoneCreateResponse,
  ZitadelUserPhoneDeleteResponse,
  ZitadelUserReactivatePostResponse,
  ZitadelUserResendVerifyCodeByEmailPostResponse,
  ZitadelUserResendVerifyCodeByPhonePostResponse,
  ZitadelUsersSearchPostResponse,
  ZitadelUserTotpDeleteResponse,
  ZitadelUserU2fDeleteResponse,
  ZitadelUserUnlockPostResponse,
} from './responses'

export class ZitadelClient {
  private httpClient: KyInstance
  private httpClientPure: KyInstance
  private wellKnown: ZitadelWellKnown | undefined
  private authenticationResponse: ZitadelAuthenticationResponse | undefined

  constructor(private options: ZitadelClientOptions) {
    this.options = options
    this.httpClient = ky.create({
      prefixUrl: this.options.issuerUrl,
      hooks: {
        beforeError: [extendedErrorInterceptor as unknown as (error: HTTPError) => Promise<HTTPError>],
      },
    })
    // https://github.com/sindresorhus/ky/pull/606
    this.httpClientPure = ky.create({
      hooks: {
        beforeError: [extendedErrorInterceptor as unknown as (error: HTTPError) => Promise<HTTPError>],
      },
    })
  }

  async setup(): Promise<void> {
    await this.fetchWellKnown()
    await this.authenticateServiceUser()
  }

  private async fetchWellKnown(): Promise<void> {
    this.wellKnown = await this.httpClient.get('.well-known/openid-configuration').json()
  }

  /*
   * Generate a JWT assertion for the service account
   * A JWT assertion is a signed JWT that is used to authenticate the service account
   * to the ZITADEL API.
   */
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

  /*
   * Authenticate the service user to the ZITADEL API
   * The service user is authenticated to the ZITADEL API using the JWT assertion
   * Access token is stored in the client for further API calls
   *
   */
  private async authenticateServiceUser(): Promise<ZitadelAuthenticationResponse> {
    const assertion = this.generateJwtAssertion()
    const grantType = 'urn:ietf:params:oauth:grant-type:jwt-bearer'
    const scope = 'openid urn:zitadel:iam:org:project:id:zitadel:aud'

    if (!this.wellKnown) {
      throw new Error('wellKnown is not defined')
    }
    const response: ZitadelAuthenticationResponse = await this.httpClientPure
      .post(this.wellKnown.token_endpoint, {
        searchParams: {
          grant_type: grantType,
          assertion,
          scope,
        },
      })
      .json()

    this.authenticationResponse = response

    this.httpClient = this.httpClient.extend({
      headers: {
        Authorization: `Bearer ${response.access_token}`,
      },
    })
    this.httpClientPure = this.httpClientPure.extend({
      headers: {
        Authorization: `Bearer ${response.access_token}`,
      },
    })
    return response
  }

  /**
   * Retrieves the current authentication response stored in the client.
   *
   * @type {ZitadelAuthenticationResponse}
   * @property {string} accessToken - The access token.
   * @property {string} refreshToken - The refresh token.
   * @property {string} idToken - The ID token.
   * @property {number} expiresIn - The expiration time in seconds.
   * @returns {ZitadelAuthenticationResponse} The stored authentication response.
   * @throws {Error} If the authentication response has not been set.
   */
  getAuthenticationResponse(): ZitadelAuthenticationResponse {
    if (!this.authenticationResponse) {
      throw new Error('authenticationResponse is not defined')
    }
    return this.authenticationResponse
  }

  /**
   * Retrieves the user info of the authenticated user.
   *
   * @type {ZitadelUserInfoGetResponse}
   * @property {string} sub - The user ID.
   * @returns {ZitadelUserInfoGetResponse} The user info response.
   * @throws {Error} If the wellKnown configuration has not been set.
   */
  async getUserInfo(): Promise<ZitadelUserInfoGetResponse> {
    if (!this.wellKnown) {
      throw new Error('wellKnown is not defined')
    }
    return this.httpClientPure.get(this.wellKnown.userinfo_endpoint).json()
  }

  /**
   * Creates a new organization.
   *
   * @param {ZitadelOrganizationCreateDto} dto - The organization create DTO.
   * @returns {Promise<ZitadelOrganizationCreateResponse>} The organization create response.
   * @throws {Error} If the request failed.
   */
  async createOrganization(
    dto: ZitadelOrganizationCreateDto,
  ): Promise<ZitadelOrganizationCreateResponse> {
    const response: ZitadelOrganizationCreateResponse = await this.httpClient
      .post(ApiEndpointsV2.ORGANIZATIONS, {
        json: dto,
      })
      .json()

    return response
  }

  /**
   * Deletes an organization.
   *
   * @param {string} orgId - The ID of the organization to delete.
   * @returns {Promise<ZitadelOrganizationDeleteResponse>} The organization delete response.
   * @throws {Error} If the request failed.
   */
  async deleteOrganization(
    orgId: string,
  ): Promise<ZitadelOrganizationDeleteResponse> {
    const response: ZitadelOrganizationDeleteResponse = await this.httpClient
      .delete(ApiEndpointsV1.ORGANIZATION, {
        headers: {
          'x-zitadel-orgid': orgId,
        },
      })
      .json()

    return response
  }

  /**
   * Creates a new human user.
   *
   * @param {ZitadelHumanUserCreateDto} dto - The human user create DTO.
   * @returns {Promise<ZitadelHumanUserCreateResponse>} The human user create response.
   * @throws {Error} If the request failed.
   */
  async createHumanUser(dto: ZitadelHumanUserCreateDto): Promise<ZitadelHumanUserCreateResponse> {
    const response: ZitadelHumanUserCreateResponse = await this.httpClient
      .post(ApiEndpointsV2.HUMAN_USERS.replace('/:userId', ''), {
        json: dto,
      })
      .json()

    return response
  }

  /**
   * Creates a new machine user.
   *
   * @param {ZitadelMachineUserCreateDto} dto - The machine user create DTO.
   * @param {string} orgId - The ID of the organization
   * @returns {Promise<ZitadelMachineUserCreateResponse>} The machine user create response.
   * @throws {Error} If the request failed.
   */
  async createMachineUser(
    dto: ZitadelMachineUserCreateDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const response: ZitadelMachineUserCreateResponse = await this.httpClient
      .post(ApiEndpointsV1.MACHINE_USERS, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async createMachineUserKey(
    userId: string,
    dto: ZitadelMachineUserKeyCreateDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserKeyCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', userId)}/keys`

    const response: ZitadelMachineUserKeyCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async getMachineUserKeyById(
    pathDto: ZitadelMachineUserKeyByIdGetPathDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserKeyByIdGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', pathDto.userId)}/keys/${pathDto.keyId}`

    const response: ZitadelMachineUserKeyByIdGetResponse = await this.httpClient
      .get(url, {
        headers,
      })
      .json()

    return response
  }

  async getMachineUserKeys(
    userId: string,
    dto: ZitadelMachineUserKeysGetDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserKeysGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', userId)}/keys/_search`

    const response: ZitadelMachineUserKeysGetResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async userDeactivate(
    userId: string,
  ): Promise<ZitadelUserDeactivatePostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${userId}/deactivate`)

    const response: ZitadelUserDeactivatePostResponse = await this.httpClient
      .post(url, {
        json: {},
      })
      .json()

    return response
  }

  async userReactivate(
    userId: string,
  ): Promise<ZitadelUserReactivatePostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${userId}/reactivate`)

    const response: ZitadelUserReactivatePostResponse = await this.httpClient
      .post(url, {
        json: {},
      })
      .json()

    return response
  }

  async userLock(
    userId: string,
  ): Promise<ZitadelUserLockPostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${userId}/lock`)

    const response: ZitadelUserLockPostResponse = await this.httpClient
      .post(url, {
        json: {},
      })
      .json()

    return response
  }

  async userUnlock(
    userId: string,
  ): Promise<ZitadelUserUnlockPostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${userId}/unlock`)

    const response: ZitadelUserUnlockPostResponse = await this.httpClient
      .post(url, {
        json: {},
      })
      .json()

    return response
  }

  async createMachineUserPAT(
    userId: string,
    dto: ZitadelMachineUserPatCreateDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserPatCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', userId)

    const response: ZitadelMachineUserPatCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async getMachineUserPAT(
    pathDto: ZitadelMachineUserPatGetPathDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserPatGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', pathDto.userId)}/${pathDto.tokenId}`

    const response: ZitadelMachineUserPatGetResponse = await this.httpClient
      .get(url, {
        headers,
      })
      .json()

    return response
  }

  async getMachineUserPATsList(
    userId: string,
    dto: ZitadelMachineUserPatsListGetDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserPatsListGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', userId)}/_search`

    const response: ZitadelMachineUserPatsListGetResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async getUserIDPsList(
    userId: string,
    dto: ZitadelMachineUserIdpsListGetDto,
  ): Promise<ZitadelMachineUserIdpsListGetResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/links/_search`

    const response: ZitadelMachineUserIdpsListGetResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async deleteMachineUserPAT(
    pathDto: ZitadelMachineUserPatDeletePathDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserPatDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', pathDto.userId)}/${pathDto.tokenId}`

    const response: ZitadelMachineUserPatDeleteResponse = await this.httpClient
      .delete(url, {
        headers,
      })
      .json()

    return response
  }

  async createProject(
    dto: ZitadelProjectCreateDto,
    orgId?: string,
  ): Promise<ZitadelProjectCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const response: ZitadelProjectCreateResponse = await this.httpClient
      .post(ApiEndpointsV1.PROJECTS, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async createAppApi(
    projectId: string,
    dto: ZitadelAppApiCreateDto,
    orgId?: string,
  ): Promise<ZitadelAppApiCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = ApiEndpointsV1.APPS_API.replace(':projectId', projectId)

    const response: ZitadelAppApiCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async deleteAppApi(
    pathDto: ZitadelAppApiDeletePathDto,
    orgId?: string,
  ): Promise<ZitadelAppApiDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.APPS_API.replace(':projectId', pathDto.projectId).replace('api', pathDto.appId)}`

    const response: ZitadelAppApiDeleteResponse = await this.httpClient
      .delete(url, {
        headers,
      })
      .json()

    return response
  }

  async createAppApiClientSecret(
    pathDto: ZitadelAppClientSecretCreatePathDto,
    orgId?: string,
  ): Promise<ZitadelAppClientSecretCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = ApiEndpointsV1.APPS_API_CLIENT_SECRETS.replace(':projectId', pathDto.projectId).replace(':appId', pathDto.appId)

    const response: ZitadelAppClientSecretCreateResponse = await this.httpClient
      .post(url, {
        headers,
      })
      .json()

    return response
  }

  async createAppOidc(
    projectId: string,
    dto: ZitadelAppOidcCreateDto,
    orgId?: string,
  ): Promise<ZitadelAppOidcCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = ApiEndpointsV1.APPS_OIDC.replace(':projectId', projectId)

    const response: ZitadelAppOidcCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async updateLoginSettings(
    dto: ZitadelLoginSettingsUpdateDto,
  ): Promise<ZitadelLoginSettingsUpdateResponse> {
    const response: ZitadelLoginSettingsUpdateResponse = await this.httpClient
      .put(ApiEndpointsV1.LOGIN_SETTINGS, {
        json: dto,
      })
      .json()

    return response
  }

  async getLoginSettings(
    orgId?: string,
  ): Promise<ZitadelLoginSettingsGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const response: ZitadelLoginSettingsGetResponse = await this.httpClient
      .get(ApiEndpointsV1.LOGIN_SETTINGS, {
        headers,
      })
      .json()

    return response
  }

  /**
   * Retrieves a user by ID.
   * @param {string} userId - The unique identifier of the user to retrieve.
   * @returns {Promise<ZitadelUserByIdGetResponse>} A promise that resolves to the user data.
   * @example
   * ```typescript
   * const userId = '1234567890'
   * const userInfo = await zitadelClient.getUserById(userId);
   * ```
   * @throws {TypeError} Thrown if the user ID is not provided.
   * @throws {Error} Thrown if the user is not found.
   * @throws {Error} Thrown if access is forbidden.
   */
  async getUserById(
    userId: string,
  ): Promise<ZitadelUserByIdGetResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}`
    const response: ZitadelUserByIdGetResponse = await this.httpClient
      .get(url)
      .json()

    return response
  }

  async deleteUserById(
    userId: string,
  ): Promise<ZitadelUserDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}`
    const response: ZitadelUserDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  /**
   * Retrieves a user by login name.
   * @param {string} loginName - The login name of the user to retrieve.
   * @returns {Promise<ZitadelUserByLoginNameGetResponse>} A promise that resolves to the user data.
   * @example
   * ```typescript
   * const loginName = 'User123'
   * const userInfo = await zitadelClient.getUserByLoginName(loginName);
   * ```
   * @throws {TypeError} Thrown if the loginName is not provided.
   * @throws {Error} Thrown if the user is not found.
   * @throws {Error} Thrown if access is forbidden.
   */
  async getUserByLoginName(
    loginName: string,
  ): Promise<ZitadelUserByLoginNameGetResponse> {
    const url = `${ApiEndpointsV1.GLOBAL_USERS}?loginName=${loginName}`

    const response: ZitadelUserByLoginNameGetResponse = await this.httpClient
      .get(url)
      .json()

    return response
  }

  async usersSearch(
    dto: ZitadelUsersSearchDto,
  ): Promise<ZitadelUsersSearchPostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace('/:userId', '')}`
    const response: ZitadelUsersSearchPostResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async getUserHistory(
    userId: string,
    dto: ZitadelUserHistoryPostDto,
    orgId?: string,
  ): Promise<ZitadelUserHistoryPostResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = UsersEndpointsV1.USER_HISTORY.replace(':userId', userId)

    const response: ZitadelUserHistoryPostResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  // deprecated use usersSearch with query search instead
  async isUserUnique(
    dto: ZitadelUserExistingCheckByUserNameOrEmailDto,
    orgId?: string,
  ): Promise<ZitadelUserExistingCheckGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    if (!dto.email && !dto.userName) {
      throw new Error('At least one of email or userName must be provided')
    }
    const searchParams = new URLSearchParams()

    if (dto.email) {
      searchParams.set('email', dto.email)
    }

    if (dto.userName) {
      searchParams.set('userName', dto.userName)
    }

    const url = `${UsersEndpointsV1.IS_UNIQUE}`

    const response: ZitadelUserExistingCheckGetResponse = await this.httpClient
      .get(url, {
        searchParams,
        headers,
      })
      .json()

    // If the user is not unique, the response will be an empty object
    if (!response.isUnique) {
      response.isUnique = false
    }

    return response
  }

  async getMetadataByKey(
    dto: ZitadelUserMetadataByKeyPathGetDto,
    orgId?: string,
  ): Promise<ZitadelUserMetadataByKeyGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.METADATA.replace(':id', dto.userId).replace(':key', dto.key)}`

    const response: ZitadelUserMetadataByKeyGetResponse = await this.httpClient
      .get(url, {
        headers,
      })
      .json()

    const decodeBase64Value = Buffer.from(response.metadata.value, 'base64').toString('utf-8')

    response.metadata.value = decodeBase64Value

    return response
  }

  async deleteMetadataByKey(
    pathDto: ZitadelUserMetadataByKeyPathDeleteDto,
    orgId?: string,
  ): Promise<ZitadelUserMetadataByKeyDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.METADATA.replace(':id', pathDto.userId).replace(':key', pathDto.key)}`

    const response: ZitadelUserMetadataByKeyDeleteResponse = await this.httpClient
      .delete(url, {
        headers,
      })
      .json()

    return response
  }

  async createMetadataByKey(
    pathDto: ZitadelUserMetadataByKeyCreatePathDto,
    dto: ZitadelUserMetadataByKeyCreateDto,
    orgId?: string,
  ): Promise<ZitadelUserMetadataByKeyCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.METADATA.replace(':id', pathDto.userId).replace(':key', pathDto.key)}`

    const encodeBase64Value = Buffer.from(dto.value, 'utf-8').toString('base64')
    dto.value = encodeBase64Value

    const response: ZitadelUserMetadataByKeyCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async deleteBulkMetadataByKey(
    userId: string,
    dto: ZitadelUserMetadataByKeyBulkDeleteDto,
    orgId?: string,
  ): Promise<ZitadelUserMetadataByKeyBulkDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.METADATA.replace(':id', userId).replace(':key', '_bulk')}`

    const response: ZitadelUserMetadataByKeyBulkDeleteResponse = await this.httpClient
      .delete(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async createBulkMetadataByKey(
    userId: string,
    dto: ZitadelUserMetadataByKeyBulkCreateDto,
    orgId?: string,
  ): Promise<ZitadelUserMetadataByKeyBulkCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.METADATA.replace(':id', userId).replace(':key', '_bulk')}`

    for (const metadata of dto.metadata) {
      const encodeBase64Value = Buffer.from(metadata.value, 'utf-8').toString('base64')
      metadata.value = encodeBase64Value
    }

    const response: ZitadelUserMetadataByKeyBulkCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async userMetadataSearch(
    userId: string,
    dto: ZitadelUserMetadataSearchDto,
    orgId?: string,
  ): Promise<ZitadelUserMetadataSearchGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.METADATA.replace(':id', userId).replace(':key', '_search')}`

    const response: ZitadelUserMetadataSearchGetResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers,
      })
      .json()

    if (response.result && response.result.length > 0) {
      for (const result of response.result) {
        if (result.value) {
          const decodeBase64Value = Buffer.from(result.value, 'base64').toString('utf-8')
          result.value = decodeBase64Value
        }
      }
    }

    return response
  }

  async deleteUserAvatar(
    userId: string,
    orgId?: string,
  ): Promise<ZitadelUserAvatarDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER_AVATAR.replace(':userId', userId)}`

    const response: ZitadelUserAvatarDeleteResponse = await this.httpClient
      .delete(url, {
        headers,
      })
      .json()

    return response
  }

  async updateMachineUser(
    userId: string,
    dto: ZitadelMachineUserUpdateDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserUpdateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.MACHINE_USER.replace(':userId', userId)}`

    const response: ZitadelMachineUserUpdateResponse = await this.httpClient
      .put(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  async updateHumanUser(
    userId: string,
    dto: ZitadelHumanUserUpdateDto,
  ): Promise<ZitadelHumanUserUpdateResponse> {
    const url = `${ApiEndpointsV2.HUMAN_USERS.replace(':userId', userId)}`

    const response: ZitadelHumanUserUpdateResponse = await this.httpClient
      .put(url, {
        json: dto,
      })
      .json()

    return response
  }

  async deleteMachineUserSecret(
    userId: string,
    orgId?: string,
  ): Promise<ZitadelMachineUserSecretDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', userId)}/secret`

    const response: ZitadelMachineUserSecretDeleteResponse = await this.httpClient
      .delete(url, {
        headers,
      })
      .json()

    return response
  }

  async deleteMachineUserKey(
    pathDto: ZitadelMachineUserKeyDeletePathDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserKeyDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', pathDto.userId)}/keys/${pathDto.keyId}`

    const response: ZitadelMachineUserKeyDeleteResponse = await this.httpClient
      .delete(url, {
        headers,
      })
      .json()

    return response
  }

  async createMachineUserSecret(
    userId: string,
    orgId?: string,
  ): Promise<ZitadelMachineUserSecretCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', userId)}/secret`

    const response: ZitadelMachineUserSecretCreateResponse = await this.httpClient
      .put(url, {
        headers,
      })
      .json()

    return response
  }

  // choose between sendCode or returnCode, if both are set, will return an error
  async createUserEmail(
    userId: string,
    dto: ZitadelUserEmailCreatePostDto,
  ): Promise<ZitadelUserEmailCreateResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/email`

    const response: ZitadelUserEmailCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async deleteUserPhone(
    userId: string,
  ): Promise<ZitadelUserPhoneDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/phone`
    const response: ZitadelUserPhoneDeleteResponse = await this.httpClient
      .delete(url, {
        json: {},
      })
      .json()

    return response
  }

  async createUserPhone(
    userId: string,
    dto: ZitadelUserPhoneCreateDto,
  ): Promise<ZitadelUserPhoneCreateResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/phone`

    const response: ZitadelUserPhoneCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async createUserPassword(
    userId: string,
    dto: ZitadelUserPasswordCreateDto,
  ): Promise<ZitadelUserPasswordCreateResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/password`

    const response: ZitadelUserPasswordCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async createUserPasswordResetCode(
    userId: string,
    dto: ZitadelUserPasswordResetCodeCreateDto,
  ): Promise<ZitadelUserPasswordResetCodeCreateResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/password_reset`

    const response: ZitadelUserPasswordResetCodeCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async resendUserEmailVerificationCode(
    userId: string,
    dto: ZitadelUserResendVerifyCodeByEmailPostDto,
  ): Promise<ZitadelUserResendVerifyCodeByEmailPostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/email/resend`

    const response: ZitadelUserResendVerifyCodeByEmailPostResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async resendUserPhoneVerificationCode(
    userId: string,
    dto: ZitadelUserResendVerifyCodeByPhonePostDto,
  ): Promise<ZitadelUserResendVerifyCodeByPhonePostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/phone/resend`

    const response: ZitadelUserResendVerifyCodeByPhonePostResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async getUserAuthMethods(
    userId: string,
    dto: ZitadelUserAuthenticationMethodsGetQueryDto,
  ): Promise<ZitadelUserAuthenticationMethodsGetResponse> {
    const queryParams: { [key: string]: string } = {}

    if (dto.includeWithoutDomain) {
      queryParams['domainQuery.includeWithoutDomain'] = dto.includeWithoutDomain.toString()
    }

    if (dto.domain) {
      queryParams['domainQuery.domain'] = dto.domain
    }

    const queryParamString = new URLSearchParams(queryParams).toString()

    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/authentication_methods${queryParamString ? `?${queryParamString}` : ''}`

    const response: ZitadelUserAuthenticationMethodsGetResponse = await this.httpClient
      .get(url)
      .json()

    return response
  }

  async deleteUserTotp(
    userId: string,
  ): Promise<ZitadelUserTotpDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/totp`

    const response: ZitadelUserTotpDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  async deleteUserU2fToken(
    pathDto: ZitadelUserU2fDeletePathDto,
  ): Promise<ZitadelUserU2fDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/u2f/${pathDto.u2fId}`

    const response: ZitadelUserU2fDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  async deleteUserOtpSms(
    userId: string,
  ): Promise<ZitadelUserOtpSmsDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/otp_sms`

    const response: ZitadelUserOtpSmsDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  async deleteUserOtpEmail(
    userId: string,
  ): Promise<ZitadelUserOtpEmailDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/otp_email`

    const response: ZitadelUserOtpEmailDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  async getUserPasskeys(
    userId: string,
    dto: ZitadelUserPasskeysGetDto,
  ): Promise<ZitadelUserPasskeysGetResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/passkeys/_search`

    const response: ZitadelUserPasskeysGetResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async registerUserPasskey(
    userId: string,
    dto: ZitadelUserPasskeyRegisterPostDto,
  ): Promise<ZitadelUserPasskeyRegisterPostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/passkeys`

    const response: ZitadelUserPasskeyRegisterPostResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async registerUserPasskeyLink(
    userId: string,
    dto: ZitadelUserPasskeyLinkRegistrationPostDto,
  ): Promise<ZitadelUserPasskeyLinkRegistrationPostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/passkeys/registration_link`

    const response: ZitadelUserPasskeyLinkRegistrationPostResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async deleteRegisteredUserPasskey(
    pathDto: ZitadelUserPasskeyDeletePathDto,
  ): Promise<ZitadelUserPasskeyDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/passkeys/${pathDto.passkeyId}`

    const response: ZitadelUserPasskeyDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  async getUserPermissions(
    userId: string,
    dto: ZitadelUserPermissionsGetDto,
    orgId?: string,
  ): Promise<ZitadelUserPermissionsGetResponseDto> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', userId)}/memberships/_search`

    const response: ZitadelUserPermissionsGetResponseDto = await this.httpClient
      .post(url, {
        json: dto,
        headers,
      })
      .json()

    return response
  }

  static generateJwtAssertion(dto: ZitadelJwtAssertionCreateDto): string {
    // Generate JWT claims
    const payload = {
      iss: dto.issuer,
      sub: dto.subject,
      aud: dto.audience,
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
      iat: Math.floor(Date.now() / 1000),
    }

    const header = {
      alg: 'RS256',
      kid: dto.keyId,
    }

    // Sign the JWT using RS256 algorithm
    const encodedJwt = jwt.sign(payload, dto.key, {
      algorithm: 'RS256',
      header,
    })
    return encodedJwt
  }
}
