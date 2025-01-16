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

  /**
   * Performs the initial setup for the client.
   *
   * This includes fetching the OpenID Connect well-known configuration
   * and authenticating the service user.
   * The setup must be called before any other method can be used.
   */
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
   * If the authentication response has not been set, an error will be thrown.
   *
   * @type {ZitadelAuthenticationResponse}
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
   * If the wellKnown configuration has not been set, an error will be thrown.
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
   * The organization is created using the provided organization create DTO.
   * Create a new organization with an administrative user.
   * If no specific roles are sent for the users,
   * they will be granted the role ORG_OWNER.
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
   * Deletes my organization and all its resources (Users, Projects, Grants to and from the org).
   * Users of this organization will not be able to log in.
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
   * The human user is created using the provided human user create DTO.
   * Create/import a new user with the type human.
   * The newly created user will get a verification email if either the email address is not marked as verified
   * and you did not request the verification to be returned.
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
   * The machine user is created using the provided machine user create DTO.
   * Create a new user with the type machine for your API, service or device.
   * These users are used for non-interactive authentication flows.
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

  /**
   * Creates a new machine user key.
   * The machine user key is created using the provided machine user key create DTO.
   * If a public key is not supplied, a new key is generated and will be returned in the response.
   * Make sure to store the returned key. If an RSA public key is supplied,
   * the private key is omitted from the response.
   * Machine keys are used to authenticate with jwt profile.
   *
   * @param {string} userId - The ID of the machine user to create the key for.
   * @param {ZitadelMachineUserKeyCreateDto} dto - The machine user key create DTO.
   * @param {string} [orgId] - The ID of the organization.
   * @returns {Promise<ZitadelMachineUserKeyCreateResponse>} The machine user key create response.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Retrieves a machine user key by ID.
   * Get the list of keys of a machine user.
   * Machine keys are used to authenticate with jwt profile authentication.
   * The retrieved machine user key ID and expiration is returned in the response.
   *
   * @param {ZitadelMachineUserKeyByIdGetPathDto} pathDto - The path DTO containing the user ID and key ID.
   * @param {string} [orgId] - The ID of the organization.
   * @returns {Promise<ZitadelMachineUserKeyByIdGetResponse>} The machine user key response.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Retrieves a list of machine user keys.
   *
   * Get the list of keys of a machine user.
   *
   * Machine keys are used to authenticate with jwt profile authentication.
   *
   * @param {string} userId - The ID of the machine user to retrieve the keys for.
   * @param {ZitadelMachineUserKeysGetDto} dto - The machine user keys get DTO.
   * @param {string} [orgId] - The ID of the organization.
   * @returns {Promise<ZitadelMachineUserKeysGetResponse>} The machine user keys response.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Deactivates a user.
   * The state of the user will be changed to 'deactivated'.
   *
   * The user will not be able to log in anymore. The method returns an error if the user is already in the state 'deactivated'.
   *
   * Use deactivate user when the user should not be able to use the account anymore,
   * but you still need access to the user data..
   *
   * @param {string} userId - The ID of the user to deactivate.
   * @returns {Promise<ZitadelUserDeactivatePostResponse>} The deactivate user response.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Reactivates a user.
   *
   * Reactivate a user with the state 'deactivated'.
   *
   * The user will be able to log in again afterward.
   *
   * The method returns an error if the user is not in the state 'deactivated'..
   *
   * @param {string} userId - The ID of the user to reactivate.
   * @returns {Promise<ZitadelUserReactivatePostResponse>} The reactivate user response.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Locks a user account.
   *
   * The state of the user will be changed to 'locked'.
   *
   * The user will not be able to log in anymore. The method returns an error if the user is already in the state 'locked'.
   *
   * Use this method if the user should not be able to log in temporarily because of an event that happened (wrong password, etc.)..
   *
   * @param {string} userId - The ID of the user to lock.
   * @returns {Promise<ZitadelUserLockPostResponse>} The lock user response.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Unlocks a user account.
   *
   * Unlock a previously locked user and change the state to 'active'.
   *
   * The user will be able to log in again.
   *
   * The method returns an error if the user is not in the state 'locked'.
   *
   * @param {string} userId - The ID of the user to unlock.
   * @returns {Promise<ZitadelUserUnlockPostResponse>} The unlock user response.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Generates a new personal access token (PAT).
   * Currently only available for machine users.
   *
   * The token will be returned in the response, make sure to store it.
   * PATs are ready-to-use tokens and can be sent directly in the authentication header.
   *
   * @param {string} userId - The ID of the machine user for whom the PAT is being created.
   * @param {ZitadelMachineUserPatCreateDto} dto - The DTO containing details for the PAT creation.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelMachineUserPatCreateResponse>} The response containing the newly created PAT details.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Retrieves a machine user personal access token (PAT) by its ID.
   *
   * Returns the PAT for a user, currently only available for machine users/service accounts.
   *
   * PATs are ready-to-use tokens and can be sent directly in the authentication header.
   *
   * @param {ZitadelMachineUserPatGetPathDto} pathDto - The DTO containing the machine user ID and PAT ID.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelMachineUserPatGetResponse>} The response containing the PAT details.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Returns a list of personal access tokens (PATs) for a user.
   *
   * currently only available for machine users/service accounts.
   *
   * PATs are ready-to-use tokens and can be sent directly in the authentication header.
   *
   * @param {string} userId - The ID of the machine user whose PATs are being retrieved.
   * @param {ZitadelMachineUserPatsListGetDto} dto - The DTO containing query parameters for the PAT list retrieval.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelMachineUserPatsListGetResponse>} The response containing the list of PATs.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Returns a list of links to an identity provider of an user.
   *
   * @param {string} userId - The ID of the user whose links are being retrieved.
   * @param {ZitadelMachineUserIdpsListGetDto} dto - The DTO containing query parameters for the link list retrieval.
   * @returns {Promise<ZitadelMachineUserIdpsListGetResponse>} The response containing the list of user links.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Deletes a personal access token (PAT) from a user.
   *
   * Afterward, the user will not be able to authenticate with that token anymore.
   *
   * @param {ZitadelMachineUserPatDeletePathDto} pathDto - The DTO containing the user ID and PAT ID to delete.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelMachineUserPatDeleteResponse>} The response confirming the deletion of the PAT.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Create a new project.
   *
   * A Project is a vessel for different applications sharing the same role context.
   *
   * @param {ZitadelProjectCreateDto} dto - The project create DTO.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelProjectCreateResponse>} The project create response.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Create a new API APP client.
   *
   * The client id will be generated and returned in the response.
   *
   * Depending on the chosen configuration also a secret will be generated and returned.
   *
   * @param {string} projectId - The ID of the project to create the API for.
   * @param {ZitadelAppApiCreateDto} dto - The project API create DTO.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelAppApiCreateResponse>} The project API create response.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Remove an application.
   *
   * It is not possible to request tokens for removed apps.
   *
   * Returns an error if the application is already deactivated.
   *
   * @param {ZitadelAppApiDeletePathDto} pathDto - The delete API APP path DTO.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelAppApiDeleteResponse>} The delete API APP response.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Creates a new client secret for an API application.
   *
   * Generates a new client secret for the API application, make sure to store the response
   *
   * The generated client secret is returned in the response.
   *
   * @param {ZitadelAppClientSecretCreatePathDto} pathDto - The path DTO containing the project ID and app ID.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelAppClientSecretCreateResponse>} The response containing the newly created client secret.
   * @throws {Error} If the request failed.
   */
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

  /**
   * Create a new OIDC client.
   *
   * The client id will be generated and returned in the response.
   *
   * Depending on the chosen configuration also a secret will be returned.
   *
   * @param {string} projectId - The ID of the project to create the OIDC application for.
   * @param {ZitadelAppOidcCreateDto} dto - The OIDC application create DTO containing the configuration details.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelAppOidcCreateResponse>} The response containing the OIDC application details, including client ID and secret.
   * @throws {Error} If the request fails.
   */
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

  /**
   * Change the login settings for the organization, that overwrites the default settings for this organization.
   *
   * The login policy defines what kind of authentication possibilities the user should have.
   * Generally speaking the behavior of the login and register UI.
   *
   * @param {ZitadelLoginSettingsUpdateDto} dto - The login settings update DTO containing the new configuration.
   * @returns {Promise<ZitadelLoginSettingsUpdateResponse>} The response containing the updated login settings configuration.
   * @throws {Error} If the request fails.
   */
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

  /**
   * Retrieves the login settings for the organization.
   *
   * Returns the login settings defined on the organization level.
   *
   * It will trigger as soon as the organization is identified (scope, user identification).
   * The login policy defines what kind of authentication possibilities the user should have.
   * Generally speaking the behavior of the login and register UI.
   *
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelLoginSettingsGetResponse>} The response containing the login settings configuration.
   * @throws {Error} If the request fails.
   */
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
   *
   * Returns the full user object (human or machine) including the profile, email, etc..
   * @param {string} userId - The unique identifier of the user to retrieve.
   * @returns {Promise<ZitadelUserByIdGetResponse>} A promise that resolves to the user data.
   * @throws {Error} Thrown if the user ID is not provided, user not found or access is forbidden.
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

  /**
   * Deletes a user by ID.
   *
   * The state of the user will be changed to 'deleted'.
   *
   * The user will not be able to log in anymore. Methods requesting this user will return an error 'User not found..
   *
   * @param {string} userId - The unique identifier of the user to delete.
   * @returns {Promise<ZitadelUserDeleteResponse>} The response containing the deleted user data.
   * @throws {Error} If the request fails.
   */
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
   *
   * Get a user by login name searched over all organizations.
   *
   * The request only returns data if the login name matches exactly.
   *
   * @deprecated Use {@link usersSearch()} instead.
   *
   * @see {@link usersSearch()} for the recommended method to retrieve users.
   * @param {string} loginName - The login name of the user to retrieve.
   * @returns {Promise<ZitadelUserByLoginNameGetResponse>} A promise that resolves to the user data.
   * @throws {Error} Thrown if the loginName is not provided, user not found or access is forbidden.
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

  /**
   * Retrieves a list of users based on the given search query.
   *
   * Search for users.
   *
   * By default, we will return all users of your instance that you have permission to read.
   * Make sure to include a limit and sorting for pagination.
   *
   * @param {ZitadelUsersSearchDto} dto - The search query.
   * @returns {Promise<ZitadelUsersSearchPostResponse>} A promise that resolves to the list of users.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Retrieves a list of history events for the given user.
   *
   * Returns a list of changes/events that have happened on the user.
   *
   * It's the history of the user. Make sure to send a limit.
   *
   * @param {string} userId - The unique identifier of the user to retrieve the history for.
   * @param {ZitadelUserHistoryPostDto} dto - The query parameters for the search.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserHistoryPostResponse>} A promise that resolves to the list of user history events.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Checks if a user is unique.
   *
   * Returns if a user with the requested email or username is unique. So you can create the user.
   *
   * @deprecated Use {@link isUserUnique()} instead.
   *
   * @see {@link isUserUnique()} for more information.
   *
   * @param {ZitadelUserExistingCheckByUserNameOrEmailDto} dto - The query parameters for the search.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserExistingCheckGetResponse>} A promise that resolves to the result of the uniqueness check.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Get a metadata object from a user by a specific key.
   *
   * @param {ZitadelUserMetadataByKeyPathGetDto} dto - The DTO containing the user ID and key.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserMetadataByKeyGetResponse>} A promise that resolves to the response containing the metadata value.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Delete a metadata object from a user by a specific key.
   *
   * @param {ZitadelUserMetadataByKeyPathDeleteDto} pathDto - The DTO containing the user ID and key.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserMetadataByKeyDeleteResponse>} A promise that resolves to the response containing the deleted metadata value.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Creates metadata for a user with a specific key.
   *
   * This method either adds or updates a metadata value for the requested key.
   *
   * @param {ZitadelUserMetadataByKeyCreatePathDto} pathDto - The DTO containing the user ID and key.
   * @param {ZitadelUserMetadataByKeyCreateDto} dto - The DTO containing the metadata value to be created.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserMetadataByKeyCreateResponse>} A promise that resolves to the response containing the created metadata.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Deletes multiple metadata for a user with the provided keys.
   *
   * Remove a list of metadata objects from a user with a list of keys.
   *
   * @param {string} userId - The ID of the user to delete the metadata for.
   * @param {ZitadelUserMetadataByKeyBulkDeleteDto} dto - The DTO containing the keys to be deleted.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserMetadataByKeyBulkDeleteResponse>} A promise that resolves to the response containing the deleted metadata.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Creates multiple metadata objects for a user with the provided keys.
   *
   * Add or update multiple metadata values for a user.
   *
   * @param {string} userId - The ID of the user to create the metadata for.
   * @param {ZitadelUserMetadataByKeyBulkCreateDto} dto - The DTO containing the keys and their respective values to be created.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserMetadataByKeyBulkCreateResponse>} A promise that resolves to the response containing the created metadata.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Get the metadata of a user filtered by your query.
   *
   * @param {string} userId - The ID of the user to search the metadata for.
   * @param {ZitadelUserMetadataSearchDto} dto - The DTO containing the search query.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserMetadataSearchGetResponse>} A promise that resolves to the response containing the search result.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Delete a user avatar.
   *
   * Removes the avatar that is currently set on the user.
   *
   * @param {string} userId - The ID of the user to delete the avatar for.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserAvatarDeleteResponse>} A promise that resolves to the response containing the deleted avatar data.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Update a machine user.
   *
   * Change a service account/machine user. It is used for accounts with non-interactive authentication possibilities.
   *
   * @param {string} userId - The ID of the machine user to update.
   * @param {ZitadelMachineUserUpdateDto} dto - The machine user update DTO.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelMachineUserUpdateResponse>} A promise that resolves to the response containing the updated machine user.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Update a human user.
   *
   * Update all information from a user..
   *
   * @param {string} userId - The ID of the human user to update.
   * @param {ZitadelHumanUserUpdateDto} dto - The human user update DTO.
   * @returns {Promise<ZitadelHumanUserUpdateResponse>} A promise that resolves to the response containing the updated human user.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Deletes the secret of a machine user.
   *
   * Delete a secret of a machine user/service account.
   * The user will not be able to authenticate with the secret afterward.
   *
   * @param {string} userId - The ID of the machine user to delete the secret for.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelMachineUserSecretDeleteResponse>} A promise that resolves to the response containing the deleted secret.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Deletes a machine user key by its ID.
   *
   * Delete a specific key from a user.
   * The user will not be able to authenticate with that key afterward.
   *
   * @param {ZitadelMachineUserKeyDeletePathDto} pathDto - The DTO containing the user ID and key ID for the key to be deleted.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelMachineUserKeyDeleteResponse>} A promise that resolves to the response containing the key deletion confirmation.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Creates a secret for a machine user.
   *
   * Create a new secret for a machine user/service account.
   *  It is used to authenticate the user (client credential grant).
   *
   * @param {string} userId - The ID of the user to create the secret for.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelMachineUserSecretCreateResponse>} A promise that resolves to the response containing the created secret.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Creates a new email for a user.
   *
   * Change the email address of a user.
   * If the state is set to not verified, a verification code will be generated,
   * which can be either returned or sent to the user by email..
   *
   * @param {string} userId - The ID of the user to create the email address for.
   * @param {ZitadelUserEmailCreatePostDto} dto - The DTO containing the new email address.
   * @returns {Promise<ZitadelUserEmailCreateResponse>} A promise that resolves to the response containing the created email address.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Deletes a phone number for a user.
   *
   * @param {string} userId - The ID of the user to delete the phone number for.
   * @returns {Promise<ZitadelUserPhoneDeleteResponse>} A promise that resolves to the response containing the deleted phone number.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Creates a new phone number for a user.
   *
   * Set the phone number of a user. If the state is set to not verified, a verification code will be generated,
   *  which can be either returned or sent to the user by sms..
   *
   * @param {string} userId - The ID of the user to create the phone number for.
   * @param {ZitadelUserPhoneCreateDto} dto - The DTO containing the new phone number information.
   * @returns {Promise<ZitadelUserPhoneCreateResponse>} A promise that resolves to the response containing the created phone number details.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Creates a password for a user.
   *
   * Change the password of a user with either a verification code or the current password..
   *
   * @param {string} userId - The ID of the user to create the password for.
   * @param {ZitadelUserPasswordCreateDto} dto - The DTO containing the password information.
   * @returns {Promise<ZitadelUserPasswordCreateResponse>} A promise that resolves to the response containing the created password details.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Creates a password reset code for a user.
   *
   * Request a verification code to reset a password..
   *
   * @param {string} userId - The ID of the user to create the password reset code for.
   * @param {ZitadelUserPasswordResetCodeCreateDto} dto - The DTO containing the password reset information.
   * @returns {Promise<ZitadelUserPasswordResetCodeCreateResponse>} A promise that resolves to the response containing the created password reset code.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Resend the verification code for a user's email address.
   *
   * Resend code to verify user email.
   *
   * @param {string} userId - The ID of the user to resend the verification code for.
   * @param {ZitadelUserResendVerifyCodeByEmailPostDto} dto - The DTO containing the resend verification code information.
   * @returns {Promise<ZitadelUserResendVerifyCodeByEmailPostResponse>} A promise that resolves to the response containing the resent verification code details.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Resend the verification code for a user's phone number.
   *
   * Resend code to verify user phone.
   *
   * @param {string} userId - The ID of the user to resend the verification code for.
   * @param {ZitadelUserResendVerifyCodeByPhonePostDto} dto - The DTO containing the resend verification code information.
   * @returns {Promise<ZitadelUserResendVerifyCodeByPhonePostResponse>} A promise that resolves to the response containing the resent verification code details.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Retrieves the authentication methods of a user.
   *
   * List all possible authentication methods of a user like password, passwordless, (T)OTP and more..
   *
   * You can filter the results by providing a domain parameters.
   *
   * @param {string} userId - The ID of the user to retrieve the authentication methods for.
   * @param {ZitadelUserAuthenticationMethodsGetQueryDto} dto - The DTO containing the query parameters.
   * @returns {Promise<ZitadelUserAuthenticationMethodsGetResponse>} A promise that resolves to the list of authentication methods.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Deletes the Time-based One-Time Password (TOTP) configuration for a user.
   *
   * Remove the configured TOTP generator of a user.
   *
   * Note: As only one TOTP generator per user is allowed, the user will not have TOTP as a second factor afterward.
   *
   * @param {string} userId - The ID of the user whose TOTP configuration is to be deleted.
   * @returns {Promise<ZitadelUserTotpDeleteResponse>} A promise that resolves to the response
   * indicating the result of the TOTP deletion operation.
   * @throws {Error} If the request fails.
   */
  async deleteUserTotp(
    userId: string,
  ): Promise<ZitadelUserTotpDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/totp`

    const response: ZitadelUserTotpDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  /**
   * Deletes a U2F token for a user.
   *
   * Removes the specified U2F token from the user.
   *
   * @param {ZitadelUserU2fDeletePathDto} pathDto - The DTO containing the user ID and U2F token ID.
   * @returns {Promise<ZitadelUserU2fDeleteResponse>} A promise that resolves to the response indicating the result of the U2F token deletion.
   * @throws {Error} Thrown if the request fails.
   */
  async deleteUserU2fToken(
    pathDto: ZitadelUserU2fDeletePathDto,
  ): Promise<ZitadelUserU2fDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/u2f/${pathDto.u2fId}`

    const response: ZitadelUserU2fDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  /**
   * Deletes the configured One-Time Password (OTP) SMS factor for a user.
   *
   * Note: As only one OTP SMS per user is allowed, the user will not have OTP SMS as a second factor afterward.
   *
   * @param {string} userId - The ID of the user whose OTP SMS configuration is to be deleted.
   * @returns {Promise<ZitadelUserOtpSmsDeleteResponse>} A promise that resolves to the response indicating the result of the OTP SMS deletion operation.
   * @throws {Error} If the request fails.
   */
  async deleteUserOtpSms(
    userId: string,
  ): Promise<ZitadelUserOtpSmsDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/otp_sms`

    const response: ZitadelUserOtpSmsDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  /**
   * Deletes the configured One-Time Password (OTP) Email factor for a user.
   *
   * Note: As only one OTP Email per user is allowed, the user will not have OTP Email as a second factor afterward.
   *
   * @param {string} userId - The ID of the user whose OTP Email configuration is to be deleted.
   * @returns {Promise<ZitadelUserOtpEmailDeleteResponse>} A promise that resolves to the response indicating the result of the OTP Email deletion operation.
   * @throws {Error} If the request fails.
   */
  async deleteUserOtpEmail(
    userId: string,
  ): Promise<ZitadelUserOtpEmailDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/otp_email`

    const response: ZitadelUserOtpEmailDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  /**
   * Retrieves a list of WebAuthn passkeys for the given user.
   *
   * @param {string} userId - The ID of the user whose passkeys are to be retrieved.
   * @param {ZitadelUserPasskeysGetDto} dto - The query parameters for the passkey list retrieval.
   * @returns {Promise<ZitadelUserPasskeysGetResponse>} A promise that resolves to the response containing the list of user passkeys.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Starts the registration of a WebAuthn passkey for a user.
   *
   * As a response the public key credential creation options are returned, which are used to verify the passkey..
   *
   * @param {string} userId - The ID of the user for whom the passkey registration is to be started.
   * @param {ZitadelUserPasskeyRegisterPostDto} dto - The DTO containing the details required for the passkey registration.
   * @returns {Promise<ZitadelUserPasskeyRegisterPostResponse>} A promise that resolves to the response containing the details of the registered passkey.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Creates a registration link for a WebAuthn passkey for a user.
   *
   * Create a passkey registration link which includes a code and either return it or send it to the user..
   *
   * @param {string} userId - The ID of the user for whom the passkey registration link is to be created.
   * @param {ZitadelUserPasskeyLinkRegistrationPostDto} dto - The DTO containing the details required for the passkey registration link.
   * @returns {Promise<ZitadelUserPasskeyLinkRegistrationPostResponse>} A promise that resolves to the response containing the passkey registration link.
   * @throws {Error} Thrown if the request fails.
   */
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

  /**
   * Deletes a registered WebAuthn passkey for a user.
   *
   * Remove a registered passkey from a user.
   *
   * @param {ZitadelUserPasskeyDeletePathDto} pathDto - The DTO containing the user ID and passkey ID of the passkey to be deleted.
   * @returns {Promise<ZitadelUserPasskeyDeleteResponse>} A promise that resolves to the response containing the deleted passkey.
   * @throws {Error} Thrown if the request fails.
   */
  async deleteRegisteredUserPasskey(
    pathDto: ZitadelUserPasskeyDeletePathDto,
  ): Promise<ZitadelUserPasskeyDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/passkeys/${pathDto.passkeyId}`

    const response: ZitadelUserPasskeyDeleteResponse = await this.httpClient
      .delete(url)
      .json()

    return response
  }

  /**
   * Retrieves the permissions of a user.
   *
   * Show all the permissions the user has in ZITADEL (ZITADEL Manager).
   *
   * @param {string} userId - The ID of the user whose permissions are to be retrieved.
   * @param {ZitadelUserPermissionsGetDto} dto - The query parameters for the permission search.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserPermissionsGetResponseDto>} A promise that resolves to the response containing the user permissions.
   * @throws {Error} Thrown if the request fails.
   */
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
