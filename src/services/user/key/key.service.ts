import { UsersEndpointsV1 } from '../../../enums'
import type { HttpClient } from '../../../core/http-client'
import type { ZitadelMachineUserKeyByIdGetPathDto, ZitadelMachineUserKeyCreateDto, ZitadelMachineUserKeyDeletePathDto, ZitadelMachineUserKeysGetDto } from '../../../dtos'
import type { ZitadelMachineUserKeyByIdGetResponse, ZitadelMachineUserKeyCreateResponse, ZitadelMachineUserKeyDeleteResponse, ZitadelMachineUserKeysGetResponse } from '../../../responses'

export class KeyMachineService {
  constructor(private httpClient: HttpClient) { }

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
  async delete(
    pathDto: ZitadelMachineUserKeyDeletePathDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserKeyDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', pathDto.userId)}/keys/${pathDto.keyId}`

    const response: ZitadelMachineUserKeyDeleteResponse = await this.httpClient.client.delete(url, {
      headers,
    }).json()

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
  async create(
    userId: string,
    dto: ZitadelMachineUserKeyCreateDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserKeyCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', userId)}/keys`

    const response: ZitadelMachineUserKeyCreateResponse = await this.httpClient.client.post(url, {
      json: dto,
      headers,
    }).json()

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
  async getById(
    pathDto: ZitadelMachineUserKeyByIdGetPathDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserKeyByIdGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', pathDto.userId)}/keys/${pathDto.keyId}`

    const response: ZitadelMachineUserKeyByIdGetResponse = await this.httpClient.client.get(url, {
      headers,
    }).json()

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
  async list(
    userId: string,
    dto?: ZitadelMachineUserKeysGetDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserKeysGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const defaults = {
      query: {
        offset: '0',
        limit: 100,
        asc: true,
      },
    }

    const url = `${UsersEndpointsV1.USER.replace(':userId', userId)}/keys/_search`

    const response: ZitadelMachineUserKeysGetResponse = await this.httpClient.client.post(url, {
      json: dto ?? defaults,
      headers,
    }).json()

    return response
  }
}
