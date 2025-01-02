import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import jwt from 'jsonwebtoken'
import ky from 'ky'
import type { HTTPError, KyInstance } from 'ky'

import { ApiEndpointsV1, ApiEndpointsV2, UsersEndpointsV1 } from './enums'

import { extendedErrorInterceptor } from './interceptors'

import type {
  ZitadelAppApiCreateDto,
  ZitadelAppApiCreateHeaderDto,
  ZitadelAppApiCreatePathDto,
  ZitadelAppClientSecretCreateHeaderDto,
  ZitadelAppClientSecretCreatePathDto,
  ZitadelAppOidcCreateDto,
  ZitadelAppOidcCreateHeaderDto,
  ZitadelAppOidcCreatePathDto,
  ZitadelHumanUserCreateDto,
  ZitadelHumanUserUpdateDto,
  ZitadelHumanUserUpdatePathDto,
  ZitadelJwtAssertionCreateDto,
  ZitadelLoginSettingsGetHeaderDto,
  ZitadelLoginSettingsUpdateDto,
  ZitadelMachineUserByIdGetHeaderDto,
  ZitadelMachineUserByIdGetPathDto,
  ZitadelMachineUserCreateDto,
  ZitadelMachineUserCreateHeaderDto,
  ZitadelMachineUserIdpsListGetDto,
  ZitadelMachineUserIdpsListGetPathDto,
  ZitadelMachineUserKeyCreateDto,
  ZitadelMachineUserKeyCreateHeaderDto,
  ZitadelMachineUserKeyCreatePathDto,
  ZitadelMachineUserKeyDeleteHeaderDto,
  ZitadelMachineUserKeyDeletePathDto,
  ZitadelMachineUserKeysGetHeaderDto,
  ZitadelMachineUserKeysGetPathDto,
  ZitadelMachineUserPatCreateDto,
  ZitadelMachineUserPatCreateHeaderDto,
  ZitadelMachineUserPatCreatePathDto,
  ZitadelMachineUserPatDeleteHeaderDto,
  ZitadelMachineUserPatDeletePathDto,
  ZitadelMachineUserPatGetHeaderDto,
  ZitadelMachineUserPatGetPathDto,
  ZitadelMachineUserPatsListGetDto,
  ZitadelMachineUserPatsListGetHeaderDto,
  ZitadelMachineUserPatsListGetPathDto,
  ZitadelMachineUserSecretCreateHeaderDto,
  ZitadelMachineUserSecretCreatePathDto,
  ZitadelMachineUserSecretDeleteHeaderDto,
  ZitadelMachineUserSecretDeletePathDto,
  ZitadelMachineUserUpdateDto,
  ZitadelMachineUserUpdateHeaderDto,
  ZitadelOrganizationCreateDto,
  ZitadelProjectCreateDto,
  ZitadelProjectCreateHeaderDto,
  ZitadelUserAuthenticationMethodsGetDto,
  ZitadelUserAuthenticationMethodsPathDto,
  ZitadelUserAvatarDeleteHeaderDto,
  ZitadelUserAvatarDeletePathDto,
  ZitadelUserByIdGetPathDto,
  ZitadelUserByLoginNameGetDto,
  ZitadelUserDeactivatePathDto,
  ZitadelUserDeletePathDto,
  ZitadelUserEmailCreatePathDto,
  ZitadelUserEmailCreatePostDto,
  ZitadelUserExistingCheckByUserNameOrEmailDto,
  ZitadelUserExistingCheckGetHeaderDto,
  ZitadelUserHistoryPostDto,
  ZitadelUserHistoryPostHeaderDto,
  ZitadelUserHistoryPostPathDto,
  ZitadelUserLockPathDto,
  ZitadelUserMetadataByKeyBulkCreateDto,
  ZitadelUserMetadataByKeyBulkCreateHeaderDto,
  ZitadelUserMetadataByKeyBulkDeleteDto,
  ZitadelUserMetadataByKeyBulkDeleteHeaderDto,
  ZitadelUserMetadataByKeyCreateDto,
  ZitadelUserMetadataByKeyCreateHeaderDto,
  ZitadelUserMetadataByKeyDeleteDto,
  ZitadelUserMetadataByKeyDeleteHeaderDto,
  ZitadelUserMetadataByKeyGetDto,
  ZitadelUserMetadataByKeyGetHeaderDto,
  ZitadelUserMetadataSearchDto,
  ZitadelUserMetadataSearchHeaderDto,
  ZitadelUserOtpEmailDeletePathDto,
  ZitadelUserOtpSmsDeletePathDto,
  ZitadelUserPasskeyDeleteDto,
  ZitadelUserPasskeyLinkRegistrationPostDto,
  ZitadelUserPasskeyLinkRegistrationPostPathDto,
  ZitadelUserPasskeyRegisterPostDto,
  ZitadelUserPasskeyRegisterPostPathDto,
  ZitadelUserPasskeysGetDto,
  ZitadelUserPasskeysGetPathDto,
  ZitadelUserPasswordCreateDto,
  ZitadelUserPasswordCreatePathDto,
  ZitadelUserPasswordResetCreateDto,
  ZitadelUserPasswordResetCreatePathDto,
  ZitadelUserPhoneCreateDto,
  ZitadelUserPhoneCreatePathDto,
  ZitadelUserPhoneDeleteDto,
  ZitadelUserPhoneDeletePathDto,
  ZitadelUserReactivatePathDto,
  ZitadelUserResendVerifyCodeByEmailPathDto,
  ZitadelUserResendVerifyCodeByEmailPostDto,
  ZitadelUserResendVerifyCodeByPhonePathDto,
  ZitadelUserResendVerifyCodeByPhonePostDto,
  ZitadelUsersSearchDto,
  ZitadelUserTotpDeletePathDto,
  ZitadelUserU2fDeletePathDto,
  ZitadelUserUnlockPathDto,
} from './dtos'

import type { ZitadelClientOptions, ZitadelWellKnown } from './interfaces'
import type {
  ZitadelAppApiCreateResponse,
  ZitadelAppClientSecretCreateResponse,
  ZitadelAppOidcCreateResponse,
  ZitadelAuthenticationResponse,
  ZitadelHumanUserCreateResponse,
  ZitadelHumanUserUpdateResponse,
  ZitadelLoginSettingsGetResponse,
  ZitadelLoginSettingsUpdateResponse,
  ZitadelMachineUserByIdGetResponse,
  ZitadelMachineUserCreateResponse,
  ZitadelMachineUserIdpsListGetResponse,
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
  ZitadelUserPasswordResetCreateResponse,
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

  getAuthenticationResponse(): ZitadelAuthenticationResponse {
    if (!this.authenticationResponse) {
      throw new Error('authenticationResponse is not defined')
    }
    return this.authenticationResponse
  }

  async getUserInfo(): Promise<unknown> {
    if (!this.wellKnown) {
      throw new Error('wellKnown is not defined')
    }
    return this.httpClientPure.get(this.wellKnown.userinfo_endpoint).json()
  }

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

  async createHumanUser(dto: ZitadelHumanUserCreateDto): Promise<ZitadelHumanUserCreateResponse> {
    const response: ZitadelHumanUserCreateResponse = await this.httpClient
      .post(ApiEndpointsV2.HUMAN_USERS.replace('/:userId', ''), {
        json: dto,
      })
      .json()
    return response
  }

  async createMachineUser(
    dto: ZitadelMachineUserCreateDto,
    headerDto: ZitadelMachineUserCreateHeaderDto,
  ): Promise<ZitadelMachineUserCreateResponse> {
    const response: ZitadelMachineUserCreateResponse = await this.httpClient
      .post(ApiEndpointsV1.MACHINE_USERS, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()
    return response
  }

  async createMachineUserKey(
    dto: ZitadelMachineUserKeyCreateDto,
    headerDto: ZitadelMachineUserKeyCreateHeaderDto,
    pathDto: ZitadelMachineUserKeyCreatePathDto,
  ): Promise<ZitadelMachineUserKeyCreateResponse> {
    const url = `${UsersEndpointsV1.USER.replace(':userId', pathDto.userId)}/keys`
    const response: ZitadelMachineUserKeyCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()
    return response
  }

  async getMachineUserById(
    pathDto: ZitadelMachineUserByIdGetPathDto,
    headerDto: ZitadelMachineUserByIdGetHeaderDto,
  ): Promise<ZitadelMachineUserByIdGetResponse> {
    const url = `${UsersEndpointsV1.USER.replace(':userId', pathDto.userId)}/keys/${pathDto.keyId}`
    const response: ZitadelMachineUserByIdGetResponse = await this.httpClient
      .get(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()
    return response
  }

  async getMachineUserKeys(
    pathDto: ZitadelMachineUserKeysGetPathDto,
    headerDto: ZitadelMachineUserKeysGetHeaderDto,
  ): Promise<ZitadelMachineUserKeysGetResponse> {
    const url = `${UsersEndpointsV1.USER.replace(':userId', pathDto.userId)}/keys/_search`
    const response: ZitadelMachineUserKeysGetResponse = await this.httpClient
      .get(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()
    return response
  }

  async userDeactivate(
    pathDto: ZitadelUserDeactivatePathDto,
  ): Promise<ZitadelUserDeactivatePostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${pathDto.userId}/deactivate`)
    const response: ZitadelUserDeactivatePostResponse = await this.httpClient
      .post(url, {
        json: {},
      })
      .json()
    return response
  }

  async userReactivate(
    pathDto: ZitadelUserReactivatePathDto,
  ): Promise<ZitadelUserReactivatePostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${pathDto.userId}/reactivate`)
    const response: ZitadelUserReactivatePostResponse = await this.httpClient
      .post(url, {
        json: {},
      })
      .json()
    return response
  }

  async userLock(
    pathDto: ZitadelUserLockPathDto,
  ): Promise<ZitadelUserLockPostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${pathDto.userId}/lock`)
    const response: ZitadelUserLockPostResponse = await this.httpClient
      .post(url, {
        json: {},
      })
      .json()
    return response
  }

  async userUnlock(
    pathDto: ZitadelUserUnlockPathDto,
  ): Promise<ZitadelUserUnlockPostResponse> {
    const url = ApiEndpointsV2.USERS.replace(':userId', `${pathDto.userId}/unlock`)
    const response: ZitadelUserUnlockPostResponse = await this.httpClient
      .post(url, {
        json: {},
      })
      .json()
    return response
  }

  async createMachineUserPAT(
    dto: ZitadelMachineUserPatCreateDto,
    headerDto: ZitadelMachineUserPatCreateHeaderDto,
    pathDto: ZitadelMachineUserPatCreatePathDto,
  ): Promise<ZitadelMachineUserPatCreateResponse> {
    const url = ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', pathDto.userId)

    const response: ZitadelMachineUserPatCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()
    return response
  }

  async getMachineUserPAT(
    headerDto: ZitadelMachineUserPatGetHeaderDto,
    pathDto: ZitadelMachineUserPatGetPathDto,
  ): Promise<ZitadelMachineUserPatGetResponse> {
    const url = `${ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', pathDto.userId)}/${pathDto.tokenId}`

    const response: ZitadelMachineUserPatGetResponse = await this.httpClient
      .get(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()
    return response
  }

  async getMachineUserPATsList(
    headerDto: ZitadelMachineUserPatsListGetHeaderDto,
    pathDto: ZitadelMachineUserPatsListGetPathDto,
    dto: ZitadelMachineUserPatsListGetDto,
  ): Promise<ZitadelMachineUserPatsListGetResponse> {
    const url = `${ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', pathDto.userId)}/_search`

    const response: ZitadelMachineUserPatsListGetResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()
    return response
  }

  async getUserIDPsList(
    dto: ZitadelMachineUserIdpsListGetDto,
    pathDto: ZitadelMachineUserIdpsListGetPathDto,
  ): Promise<ZitadelMachineUserIdpsListGetResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/links/_search`

    const response: ZitadelMachineUserIdpsListGetResponse = await this.httpClient
      .get(url, {
        json: dto,
      })
      .json()
    return response
  }

  async deleteMachineUserPAT(
    headerDto: ZitadelMachineUserPatDeleteHeaderDto,
    pathDto: ZitadelMachineUserPatDeletePathDto,
  ): Promise<ZitadelMachineUserPatDeleteResponse> {
    const url = `${ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', pathDto.userId)}/${pathDto.tokenId}`

    const response: ZitadelMachineUserPatDeleteResponse = await this.httpClient
      .delete(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()
    return response
  }

  async createProject(
    dto: ZitadelProjectCreateDto,
    headerDto: ZitadelProjectCreateHeaderDto,
  ): Promise<ZitadelProjectCreateResponse> {
    const response: ZitadelProjectCreateResponse = await this.httpClient
      .post(ApiEndpointsV1.PROJECTS, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async createAppApi(
    dto: ZitadelAppApiCreateDto,
    headerDto: ZitadelAppApiCreateHeaderDto,
    pathDto: ZitadelAppApiCreatePathDto,
  ): Promise<ZitadelAppApiCreateResponse> {
    const url = ApiEndpointsV1.APPS_API.replace(':projectId', pathDto.projectId)
    const response: ZitadelAppApiCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async createAppApiClientSecret(
    headerDto: ZitadelAppClientSecretCreateHeaderDto,
    pathDto: ZitadelAppClientSecretCreatePathDto,
  ): Promise<ZitadelAppClientSecretCreateResponse> {
    const url = ApiEndpointsV1.APPS_API_CLIENT_SECRETS.replace(
      ':projectId',
      pathDto.projectId,
    ).replace(':appId', pathDto.appId)
    const response: ZitadelAppClientSecretCreateResponse = await this.httpClient
      .post(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()
    return response
  }

  async createAppOidc(
    dto: ZitadelAppOidcCreateDto,
    headerDto: ZitadelAppOidcCreateHeaderDto,
    pathDto: ZitadelAppOidcCreatePathDto,
  ): Promise<ZitadelAppOidcCreateResponse> {
    const url = ApiEndpointsV1.APPS_OIDC.replace(':projectId', pathDto.projectId)
    const response: ZitadelAppOidcCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
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
    headerDto: ZitadelLoginSettingsGetHeaderDto,
  ): Promise<ZitadelLoginSettingsGetResponse> {
    const response: ZitadelLoginSettingsGetResponse = await this.httpClient
      .get(ApiEndpointsV1.LOGIN_SETTINGS, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  /**
   * Retrieves a user by ID.
   * @param {ZitadelUserByIdGetPathDto} pathDto - The path parameters for the request.
   * @param {string} pathDto.userId - The unique identifier of the user to retrieve.
   * @returns {Promise<ZitadelUserByIdGetResponse>} A promise that resolves to the user data.
   * @example
   * ```typescript
   * const userId = '1234567890'
   * const userInfo = await zitadelClient.getUserById({ userId });
   * ```
   * @throws {TypeError} Thrown if the user ID is not provided.
   * @throws {Error} Thrown if the user is not found.
   * @throws {Error} Thrown if access is forbidden.
   */
  async getUserById(
    pathDto: ZitadelUserByIdGetPathDto,
  ): Promise<ZitadelUserByIdGetResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}`
    const response: ZitadelUserByIdGetResponse = await this.httpClient
      .get(url)
      .json()

    return response
  }

  async deleteUserById(
    pathDto: ZitadelUserDeletePathDto,
  ): Promise<ZitadelUserDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}`
    const response: ZitadelUserDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  /**
   * Retrieves a user by login name.
   * @param {ZitadelUserByLoginNameGetDto} dto - The path parameters for the request.
   * @param {string} dto.loginName - The login name of the user to retrieve.
   * @returns {Promise<ZitadelUserByLoginNameGetResponse>} A promise that resolves to the user data.
   * @example
   * ```typescript
   * const userName = 'User123'
   * const userInfo = await zitadelClient.getUserByLoginName({ userName });
   * ```
   * @throws {TypeError} Thrown if the userName is not provided.
   * @throws {Error} Thrown if the user is not found.
   * @throws {Error} Thrown if access is forbidden.
   */
  async getUserByLoginName(
    dto: ZitadelUserByLoginNameGetDto,
  ): Promise<ZitadelUserByLoginNameGetResponse> {
    const url = `${ApiEndpointsV1.GLOBAL_USERS}`
    const response: ZitadelUserByLoginNameGetResponse = await this.httpClient
      .get(url, { searchParams: { loginName: dto.loginName } })
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
    dto: ZitadelUserHistoryPostDto,
    headerDto: ZitadelUserHistoryPostHeaderDto,
    pathDto: ZitadelUserHistoryPostPathDto,
  ): Promise<ZitadelUserHistoryPostResponse> {
    const url = UsersEndpointsV1.USER_HISTORY.replace(':userId', pathDto.userId)
    const response: ZitadelUserHistoryPostResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  // deprecated use usersSearch with query search instead
  async isUserUnique(
    dto: ZitadelUserExistingCheckByUserNameOrEmailDto,
    headerDto: ZitadelUserExistingCheckGetHeaderDto,
  ): Promise<ZitadelUserExistingCheckGetResponse> {
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
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    // If the user is not unique, the response will be an empty object
    if (!response.isUnique) {
      response.isUnique = false
    }

    return response
  }

  async getMetadataByKey(
    dto: ZitadelUserMetadataByKeyGetDto,
    headerDto: ZitadelUserMetadataByKeyGetHeaderDto,
  ): Promise<ZitadelUserMetadataByKeyGetResponse> {
    const url = `${ApiEndpointsV1.METADATA.replace(':id', dto.userId).replace(':key', dto.key)}`
    const response: ZitadelUserMetadataByKeyGetResponse = await this.httpClient
      .get(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    const decodeBase64Value = Buffer.from(response.metadata.value, 'base64').toString('utf-8')
    response.metadata.value = decodeBase64Value

    return response
  }

  async deleteMetadataByKey(
    dto: ZitadelUserMetadataByKeyDeleteDto,
    headerDto: ZitadelUserMetadataByKeyDeleteHeaderDto,
  ): Promise<ZitadelUserMetadataByKeyDeleteResponse> {
    const url = `${ApiEndpointsV1.METADATA.replace(':id', dto.userId).replace(':key', dto.key)}`
    const response: ZitadelUserMetadataByKeyDeleteResponse = await this.httpClient
      .delete(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async createMetadataByKey(
    dto: ZitadelUserMetadataByKeyCreateDto,
    headerDto: ZitadelUserMetadataByKeyCreateHeaderDto,
  ): Promise<ZitadelUserMetadataByKeyCreateResponse> {
    const url = `${ApiEndpointsV1.METADATA.replace(':id', dto.userId).replace(':key', dto.key)}`
    const encodeBase64Value = Buffer.from(dto.value, 'utf-8').toString('base64')
    dto.value = encodeBase64Value
    const response: ZitadelUserMetadataByKeyCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async deleteBulkMetadataByKey(
    dto: ZitadelUserMetadataByKeyBulkDeleteDto,
    headerDto: ZitadelUserMetadataByKeyBulkDeleteHeaderDto,
  ): Promise<ZitadelUserMetadataByKeyBulkDeleteResponse> {
    const url = `${ApiEndpointsV1.METADATA.replace(':id', dto.userId).replace(':key', '_bulk')}`
    const response: ZitadelUserMetadataByKeyBulkDeleteResponse = await this.httpClient
      .delete(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async createBulkMetadataByKey(
    dto: ZitadelUserMetadataByKeyBulkCreateDto,
    headerDto: ZitadelUserMetadataByKeyBulkCreateHeaderDto,
  ): Promise<ZitadelUserMetadataByKeyBulkCreateResponse> {
    const url = `${ApiEndpointsV1.METADATA.replace(':id', dto.userId).replace(':key', '_bulk')}`
    const response: ZitadelUserMetadataByKeyBulkCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async userMetadataSearch(
    dto: ZitadelUserMetadataSearchDto,
    headerDto: ZitadelUserMetadataSearchHeaderDto,
  ): Promise<ZitadelUserMetadataSearchGetResponse> {
    const url = `${ApiEndpointsV1.METADATA.replace(':id', dto.userId).replace(':key', '_search')}`
    const response: ZitadelUserMetadataSearchGetResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
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
    pathDto: ZitadelUserAvatarDeletePathDto,
    headerDto: ZitadelUserAvatarDeleteHeaderDto,
  ): Promise<ZitadelUserAvatarDeleteResponse> {
    const url = `${UsersEndpointsV1.USER_AVATAR.replace(':userId', pathDto.userId)}`
    const response: ZitadelUserAvatarDeleteResponse = await this.httpClient
      .delete(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async updateMachineUser(
    dto: ZitadelMachineUserUpdateDto,
    headerDto: ZitadelMachineUserUpdateHeaderDto,
  ): Promise<ZitadelMachineUserUpdateResponse> {
    const url = `${UsersEndpointsV1.MACHINE_USER.replace(':userId', dto.userId)}`
    const response: ZitadelMachineUserUpdateResponse = await this.httpClient
      .put(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async updateHumanUser(
    pathDto: ZitadelHumanUserUpdatePathDto,
    dto: ZitadelHumanUserUpdateDto,
  ): Promise<ZitadelHumanUserUpdateResponse> {
    const url = `${ApiEndpointsV2.HUMAN_USERS.replace(':userId', pathDto.userId)}`
    const response: ZitadelHumanUserUpdateResponse = await this.httpClient
      .put(url, {
        json: dto,
      })
      .json()

    return response
  }

  async deleteMachineUserSecret(
    pathDto: ZitadelMachineUserSecretDeletePathDto,
    headerDto: ZitadelMachineUserSecretDeleteHeaderDto,
  ): Promise<ZitadelMachineUserSecretDeleteResponse> {
    const url = `${UsersEndpointsV1.USER.replace(':userId', pathDto.userId)}/secret`
    const response: ZitadelMachineUserSecretDeleteResponse = await this.httpClient
      .delete(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async deleteMachineUserKey(
    pathDto: ZitadelMachineUserKeyDeletePathDto,
    headerDto: ZitadelMachineUserKeyDeleteHeaderDto,
  ): Promise<ZitadelMachineUserKeyDeleteResponse> {
    const url = `${UsersEndpointsV1.USER.replace(':userId', pathDto.userId)}/keys/${pathDto.keyId}`
    const response: ZitadelMachineUserKeyDeleteResponse = await this.httpClient
      .delete(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async createMachineUserSecret(
    pathDto: ZitadelMachineUserSecretCreatePathDto,
    headerDto: ZitadelMachineUserSecretCreateHeaderDto,
  ): Promise<ZitadelMachineUserSecretCreateResponse> {
    const url = `${UsersEndpointsV1.USER.replace(':userId', pathDto.userId)}/secret`
    const response: ZitadelMachineUserSecretCreateResponse = await this.httpClient
      .put(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async createUserEmail(
    pathDto: ZitadelUserEmailCreatePathDto,
    dto: ZitadelUserEmailCreatePostDto,
  ): Promise<ZitadelUserEmailCreateResponse> {
    const url = `${ApiEndpointsV2.HUMAN_USERS.replace(':userId', pathDto.userId)}/email`
    const response: ZitadelUserEmailCreateResponse = await this.httpClient
      .put(url, {
        json: dto,
      })
      .json()

    return response
  }

  async deleteUserPhone(
    pathDto: ZitadelUserPhoneDeletePathDto,
    dto: ZitadelUserPhoneDeleteDto,
  ): Promise<ZitadelUserPhoneDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/phone`
    const response: ZitadelUserPhoneDeleteResponse = await this.httpClient
      .delete(url, {
        json: dto,
      })
      .json()

    return response
  }

  async createUserPhone(
    pathDto: ZitadelUserPhoneCreatePathDto,
    dto: ZitadelUserPhoneCreateDto,
  ): Promise<ZitadelUserPhoneCreateResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/phone`
    const response: ZitadelUserPhoneCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async createUserPassword(
    pathDto: ZitadelUserPasswordCreatePathDto,
    dto: ZitadelUserPasswordCreateDto,
  ): Promise<ZitadelUserPasswordCreateResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/password`
    const response: ZitadelUserPasswordCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async createUserPasswordReset(
    pathDto: ZitadelUserPasswordResetCreatePathDto,
    dto: ZitadelUserPasswordResetCreateDto,
  ): Promise<ZitadelUserPasswordResetCreateResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/password_reset`
    const response: ZitadelUserPasswordResetCreateResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async resendUserEmailVerificationCode(
    pathDto: ZitadelUserResendVerifyCodeByEmailPathDto,
    dto: ZitadelUserResendVerifyCodeByEmailPostDto,
  ): Promise<ZitadelUserResendVerifyCodeByEmailPostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/email/resend`
    const response: ZitadelUserResendVerifyCodeByEmailPostResponse = await this.httpClient
      .put(url, {
        json: dto,
      })
      .json()

    return response
  }

  async resendUserPhoneVerificationCode(
    pathDto: ZitadelUserResendVerifyCodeByPhonePathDto,
    dto: ZitadelUserResendVerifyCodeByPhonePostDto,
  ): Promise<ZitadelUserResendVerifyCodeByPhonePostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/phone/resend`
    const response: ZitadelUserResendVerifyCodeByPhonePostResponse = await this.httpClient
      .put(url, {
        json: dto,
      })
      .json()

    return response
  }

  async getUserAuthMethods(
    pathDto: ZitadelUserAuthenticationMethodsPathDto,
    dto: ZitadelUserAuthenticationMethodsGetDto,
  ): Promise<ZitadelUserAuthenticationMethodsGetResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/authentication_methods`
    const response: ZitadelUserAuthenticationMethodsGetResponse = await this.httpClient
      .get(url, {
        json: dto,
      })
      .json()

    return response
  }

  async deleteUserTotp(
    pathDto: ZitadelUserTotpDeletePathDto,
  ): Promise<ZitadelUserTotpDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/totp`
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
    pathDto: ZitadelUserOtpSmsDeletePathDto,
  ): Promise<ZitadelUserOtpSmsDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/otp_sms`
    const response: ZitadelUserOtpSmsDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  async deleteUserOtpEmail(
    pathDto: ZitadelUserOtpEmailDeletePathDto,
  ): Promise<ZitadelUserOtpEmailDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/otp_email`
    const response: ZitadelUserOtpEmailDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  async getUserPasskeys(
    pathDto: ZitadelUserPasskeysGetPathDto,
    dto: ZitadelUserPasskeysGetDto,
  ): Promise<ZitadelUserPasskeysGetResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/passkeys/_search`
    const response: ZitadelUserPasskeysGetResponse = await this.httpClient
      .get(url, {
        json: dto,
      })
      .json()

    return response
  }

  async RegisterUserPasskey(
    pathDto: ZitadelUserPasskeyRegisterPostPathDto,
    dto: ZitadelUserPasskeyRegisterPostDto,
  ): Promise<ZitadelUserPasskeyRegisterPostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/passkeys`
    const response: ZitadelUserPasskeyRegisterPostResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async RegisterUserPasskeyLink(
    pathDto: ZitadelUserPasskeyLinkRegistrationPostPathDto,
    dto: ZitadelUserPasskeyLinkRegistrationPostDto,
  ): Promise<ZitadelUserPasskeyLinkRegistrationPostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/passkeys/registration_link`
    const response: ZitadelUserPasskeyLinkRegistrationPostResponse = await this.httpClient
      .post(url, {
        json: dto,
      })
      .json()

    return response
  }

  async RegisterUserPasskeyDelete(
    dto: ZitadelUserPasskeyDeleteDto,
  ): Promise<ZitadelUserPasskeyDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS}.replace(':userId', ${dto.userId})/passkeys/${dto.passkeyId}`
    const response: ZitadelUserPasskeyDeleteResponse = await this.httpClient
      .delete(url, {
        json: dto,
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
