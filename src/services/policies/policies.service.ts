import { ApiEndpointsV1 } from '../../enums'
import type { HttpClient } from '../../core/http-client'
import type { ZitadelLoginSettingsUpdateDto } from '../../dtos'
import type { ZitadelLoginSettingsGetResponse, ZitadelLoginSettingsUpdateResponse } from '../../responses'

export class PoliciesService {
  constructor(private httpClient: HttpClient) { }

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
    const response: ZitadelLoginSettingsUpdateResponse = await this.httpClient.client.put(ApiEndpointsV1.LOGIN_SETTINGS, {
      json: dto,
    }).json()

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

    const response: ZitadelLoginSettingsGetResponse = await this.httpClient.client.get(ApiEndpointsV1.LOGIN_SETTINGS, {
      headers,
    }).json()

    return response
  }
}
