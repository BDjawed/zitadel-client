import { Buffer } from 'node:buffer'
import { ApiEndpointsV1 } from '../../../enums'
import type { HttpClient } from '../../../core/http-client'
import type { ZitadelUserMetadataByKeyBulkCreateDto, ZitadelUserMetadataByKeyBulkDeleteDto, ZitadelUserMetadataByKeyCreateDto, ZitadelUserMetadataByKeyCreatePathDto, ZitadelUserMetadataByKeyPathDeleteDto, ZitadelUserMetadataByKeyPathGetDto, ZitadelUserMetadataSearchDto } from '../../../dtos'
import type { ZitadelUserMetadataByKeyBulkCreateResponse, ZitadelUserMetadataByKeyBulkDeleteResponse, ZitadelUserMetadataByKeyCreateResponse, ZitadelUserMetadataByKeyDeleteResponse, ZitadelUserMetadataByKeyGetResponse, ZitadelUserMetadataSearchGetResponse } from '../../../responses'

export class MetadataService {
  constructor(private httpClient: HttpClient) { }

  /**
   * Get a metadata object from a user by a specific key.
   *
   * @param {ZitadelUserMetadataByKeyPathGetDto} dto - The DTO containing the user ID and key.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelUserMetadataByKeyGetResponse>} A promise that resolves to the response containing the metadata value.
   * @throws {Error} Thrown if the request fails.
   */
  async getByKey(
    dto: ZitadelUserMetadataByKeyPathGetDto,
    orgId?: string,
  ): Promise<ZitadelUserMetadataByKeyGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.METADATA.replace(':id', dto.userId).replace(':key', dto.key)}`

    const response: ZitadelUserMetadataByKeyGetResponse = await this.httpClient.client.get(url, {
      headers,
    }).json()

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
  async deleteByKey(
    pathDto: ZitadelUserMetadataByKeyPathDeleteDto,
    orgId?: string,
  ): Promise<ZitadelUserMetadataByKeyDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.METADATA.replace(':id', pathDto.userId).replace(':key', pathDto.key)}`

    const response: ZitadelUserMetadataByKeyDeleteResponse = await this.httpClient.client.delete(url, {
      headers,
    }).json()

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
  async createByKey(
    pathDto: ZitadelUserMetadataByKeyCreatePathDto,
    dto: ZitadelUserMetadataByKeyCreateDto,
    orgId?: string,
  ): Promise<ZitadelUserMetadataByKeyCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.METADATA.replace(':id', pathDto.userId).replace(':key', pathDto.key)}`

    const encodeBase64Value = Buffer.from(dto.value, 'utf-8').toString('base64')
    dto.value = encodeBase64Value

    const response: ZitadelUserMetadataByKeyCreateResponse = await this.httpClient.client.post(url, {
      json: dto,
      headers,
    }).json()

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
  async bulkDeleteByKey(
    userId: string,
    dto: ZitadelUserMetadataByKeyBulkDeleteDto,
    orgId?: string,
  ): Promise<ZitadelUserMetadataByKeyBulkDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.METADATA.replace(':id', userId).replace(':key', '_bulk')}`

    const response: ZitadelUserMetadataByKeyBulkDeleteResponse = await this.httpClient.client.delete(url, {
      json: dto,
      headers,
    }).json()

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
  async bulkCreateByKey(
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

    const response: ZitadelUserMetadataByKeyBulkCreateResponse = await this.httpClient.client.post(url, {
      json: dto,
      headers,
    }).json()

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
  async search(
    userId: string,
    dto: ZitadelUserMetadataSearchDto,
    orgId?: string,
  ): Promise<ZitadelUserMetadataSearchGetResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${ApiEndpointsV1.METADATA.replace(':id', userId).replace(':key', '_search')}`

    const response: ZitadelUserMetadataSearchGetResponse = await this.httpClient.client.post(url, {
      json: dto,
      headers,
    }).json()

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
}
