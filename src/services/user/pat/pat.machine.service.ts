import { ApiEndpointsV1 } from '../../../enums'
import type { HttpClient } from '../../../core/http-client'
import type { ZitadelMachineUserPatCreateDto, ZitadelMachineUserPatDeletePathDto, ZitadelMachineUserPatGetPathDto, ZitadelMachineUserPatsListGetDto } from '../../../dtos'
import type { ZitadelMachineUserPatCreateResponse, ZitadelMachineUserPatDeleteResponse, ZitadelMachineUserPatGetResponse, ZitadelMachineUserPatsListGetResponse } from '../../../responses'

export class PatMachineService {
  constructor(private httpClient: HttpClient) { }

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
  async create(
    userId: string,
    dto: ZitadelMachineUserPatCreateDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserPatCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', userId)

    const response: ZitadelMachineUserPatCreateResponse = await this.httpClient.client.post(url, {
      json: dto,
      headers,
    }).json()

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
  async getById(
    pathDto: ZitadelMachineUserPatGetPathDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserPatGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', pathDto.userId)}/${pathDto.tokenId}`

    const response: ZitadelMachineUserPatGetResponse = await this.httpClient.client.get(url, {
      headers,
    }).json()

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
  async list(
    userId: string,
    dto: ZitadelMachineUserPatsListGetDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserPatsListGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', userId)}/_search`

    const response: ZitadelMachineUserPatsListGetResponse = await this.httpClient.client.post(url, {
      json: dto,
      headers,
    }).json()

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
  async delete(
    pathDto: ZitadelMachineUserPatDeletePathDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserPatDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.MACHINE_USERS_PATS.replace(':userId', pathDto.userId)}/${pathDto.tokenId}`

    const response: ZitadelMachineUserPatDeleteResponse = await this.httpClient.client.delete(url, {
      headers,
    }).json()

    return response
  }
}
