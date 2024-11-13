import fs from 'node:fs'
import jwt from 'jsonwebtoken'
import ky from 'ky'
import type { KyInstance } from 'ky'

import { ApiEndpointsV1, ApiEndpointsV2 } from './enums'

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
  ZitadelLoginSettingsUpdateDto,
  ZitadelMachineUserCreateDto,
  ZitadelMachineUserCreateHeaderDto,
  ZitadelMachineUserPatCreateDto,
  ZitadelMachineUserPatCreateHeaderDto,
  ZitadelMachineUserPatCreatePathDto,
  ZitadelOrganizationCreateDto,
} from './dtos'

import type { ZitadelProjectCreateDto, ZitadelProjectCreateHeaderDto } from './dtos/project-create.dto'
import type { ZitadelClientOptions, ZitadelWellKnown } from './interfaces'
import type {
  ZitadelAppApiCreateResponse,
  ZitadelAppClientSecretCreateResponse,
  ZitadelAppOidcCreateResponse,
  ZitadelHumanUserCreateResponse,
  ZitadelLoginSettingsUpdateResponse,
  ZitadelMachineUserCreateResponse,
  ZitadelMachineUserPatCreateResponse,
  ZitadelOrganizationCreateResponse,
  ZitadelProjectCreateResponse,
  ZitedelAuthenticationResponse,
} from './responses'

export class ZitadelClient {
  private httpClient: KyInstance
  private httpClientPure: KyInstance
  private wellKnown: ZitadelWellKnown | undefined

  constructor(private options: ZitadelClientOptions) {
    this.options = options
    this.httpClient = ky.create({
      prefixUrl: this.options.issuerUrl,
    })
    // https://github.com/sindresorhus/ky/pull/606
    this.httpClientPure = ky.create({})
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
    // Read the key file content
    const keyFileContent = JSON.parse(fs.readFileSync(this.options.privateJwtKeyPath, 'utf-8'))

    // Generate JWT claims
    const payload = {
      iss: keyFileContent.userId,
      sub: keyFileContent.userId,
      aud: this.options.issuerUrl,
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
      iat: Math.floor(Date.now() / 1000),
    }

    const header = {
      alg: 'RS256',
      kid: keyFileContent.keyId,
    }

    // Sign the JWT using RS256 algorithm
    const encodedJwt = jwt.sign(payload, keyFileContent.key, {
      algorithm: 'RS256',
      header,
    })

    return encodedJwt
  }

  /*
   * Authenticate the service user to the ZITADEL API
   * The service user is authenticated to the ZITADEL API using the JWT assertion
   * Access token is stored in the client for further API calls
   *
   */
  private async authenticateServiceUser(): Promise<ZitedelAuthenticationResponse> {
    const assertion = this.generateJwtAssertion()
    const grantType = 'urn:ietf:params:oauth:grant-type:jwt-bearer'
    const scope = `openid urn:zitadel:iam:org:project:id:zitadel:aud`

    if (!this.wellKnown) {
      throw new Error('wellKnown is not defined')
    }
    const response: ZitedelAuthenticationResponse = await this.httpClientPure
      .post(this.wellKnown.token_endpoint, {
        searchParams: {
          grant_type: grantType,
          assertion,
          scope,
        },
      })
      .json()

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
}
