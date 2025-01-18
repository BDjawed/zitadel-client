import { ApiEndpointsV1 } from '../../enums'
import type { HttpClient } from '../../core/http-client'
import type { ZitadelAppApiCreateDto, ZitadelAppApiDeletePathDto, ZitadelAppClientSecretCreatePathDto, ZitadelAppOidcCreateDto } from '../../dtos'
import type { ZitadelAppApiCreateResponse, ZitadelAppApiDeleteResponse, ZitadelAppClientSecretCreateResponse, ZitadelAppOidcCreateResponse } from '../../responses'

export class AppService {
  constructor(private httpClient: HttpClient) { }

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
  async create(
    projectId: string,
    dto: ZitadelAppApiCreateDto,
    orgId?: string,
  ): Promise<ZitadelAppApiCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = ApiEndpointsV1.APPS_API.replace(':projectId', projectId)

    const response: ZitadelAppApiCreateResponse = await this.httpClient.client.post(url, {
      json: dto,
      headers,
    }).json()

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
  async delete(
    pathDto: ZitadelAppApiDeletePathDto,
    orgId?: string,
  ): Promise<ZitadelAppApiDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.APPS_API.replace(':projectId', pathDto.projectId).replace('api', pathDto.appId)}`

    const response: ZitadelAppApiDeleteResponse = await this.httpClient.client.delete(url, {
      headers,
    }).json()

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
  async createClientSecret(
    pathDto: ZitadelAppClientSecretCreatePathDto,
    orgId?: string,
  ): Promise<ZitadelAppClientSecretCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = ApiEndpointsV1.APPS_API_CLIENT_SECRETS.replace(':projectId', pathDto.projectId).replace(':appId', pathDto.appId)

    const response: ZitadelAppClientSecretCreateResponse = await this.httpClient.client.post(url, {
      headers,
    }).json()

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
  async createOidc(
    projectId: string,
    dto: ZitadelAppOidcCreateDto,
    orgId?: string,
  ): Promise<ZitadelAppOidcCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = ApiEndpointsV1.APPS_OIDC.replace(':projectId', projectId)

    const response: ZitadelAppOidcCreateResponse = await this.httpClient.client.post(url, {
      json: dto,
      headers,
    }).json()

    return response
  }
}
