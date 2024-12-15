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
  ZitadelJwtAssertionCreateDto,
  ZitadelLoginSettingsUpdateDto,
  ZitadelMachineUserCreateDto,
  ZitadelMachineUserCreateHeaderDto,
  ZitadelMachineUserPatCreateDto,
  ZitadelMachineUserPatCreateHeaderDto,
  ZitadelMachineUserPatCreatePathDto,
  ZitadelOrganizationCreateDto,
  ZitadelProjectCreateDto,
  ZitadelProjectCreateHeaderDto,
  ZitadelUserByIdGetDto,
  ZitadelUserByIdGetHeaderDto,
  ZitadelUserByIdGetPathDto,
  ZitadelUserByLoginNameGetDto,
  ZitadelUserDeleteDto,
  ZitadelUserDeleteHeaderDto,
  ZitadelUserDeletePathDto,
  ZitadelUserExistingCheckByUserNameOrEmailDto,
  ZitadelUserExistingCheckGetHeaderDto,
  ZitadelUserHistoryPostDto,
  ZitadelUserHistoryPostHeaderDto,
  ZitadelUserHistoryPostPathDto,
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
  ZitadelUsersSearchDto,
  ZitadelUsersSearchHeaderDto,
} from './dtos'

import type { ZitadelClientOptions, ZitadelWellKnown } from './interfaces'
import type {
  ZitadelAppApiCreateResponse,
  ZitadelAppClientSecretCreateResponse,
  ZitadelAppOidcCreateResponse,
  ZitadelAuthenticationResponse,
  ZitadelHumanUserCreateResponse,
  ZitadelLoginSettingsUpdateResponse,
  ZitadelMachineUserCreateResponse,
  ZitadelMachineUserPatCreateResponse,
  ZitadelOrganizationCreateResponse,
  ZitadelProjectCreateResponse,
  ZitadelSearchUsersPostResponse,
  ZitadelUserByIdGetResponse,
  ZitadelUserDeleteResponse,
  ZitadelUserExistingCheckGetResponse,
  ZitadelUserHistoryPostResponse,
  ZitadelUserMetadataByKeyBulkCreateResponse,
  ZitadelUserMetadataByKeyBulkDeleteResponse,
  ZitadelUserMetadataByKeyCreateResponse,
  ZitadelUserMetadataByKeyDeleteResponse,
  ZitadelUserMetadataByKeyGetResponse,
  ZitadelUserMetadataSearchGetResponse,
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
      .post(ApiEndpointsV2.HUMAN_USERS, {
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

  // todo: update the endpoint from UsersEndpointsV1
  async getUserById(
    dto: ZitadelUserByIdGetDto,
    headerDto: ZitadelUserByIdGetHeaderDto,
    pathDto: ZitadelUserByIdGetPathDto,
  ): Promise<ZitadelUserByIdGetResponse> {
    const url = `${ApiEndpointsV1.USERS.replace(':projectId', pathDto.projectId)}/${dto.userId}`
    const response: ZitadelUserByIdGetResponse = await this.httpClient
      .get(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  // todo: update the endpoint from UsersEndpointsV1
  async deleteUserById(
    dto: ZitadelUserDeleteDto,
    headerDto: ZitadelUserDeleteHeaderDto,
    pathDto: ZitadelUserDeletePathDto,
  ): Promise<ZitadelUserDeleteResponse> {
    const url = `${ApiEndpointsV1.USERS.replace(':projectId', pathDto.projectId)}/${dto.userId}`
    const response: ZitadelUserDeleteResponse = await this.httpClient
      .delete(url, {
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
      })
      .json()

    return response
  }

  async getUserByLoginName(
    dto: ZitadelUserByLoginNameGetDto,
  ): Promise<ZitadelUserByIdGetResponse> {
    const url = `${ApiEndpointsV1.GLOBAL_USERS}`
    const response: ZitadelUserByIdGetResponse = await this.httpClient
      .get(url, { searchParams: { loginName: dto.loginName } })
      .json()

    return response
  }

  async usersSearch(
    dto: ZitadelUsersSearchDto,
    headerDto: ZitadelUsersSearchHeaderDto,
  ): Promise<ZitadelSearchUsersPostResponse> {
    const url = `${ApiEndpointsV1.USERS}/${'_search'}`
    const response: ZitadelSearchUsersPostResponse = await this.httpClient
      .post(url, {
        json: dto,
        headers: {
          'x-zitadel-orgid': headerDto['x-zitadel-orgid'],
        },
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
