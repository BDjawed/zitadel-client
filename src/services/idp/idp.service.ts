import { ApiEndpointsV2 } from '../../enums'
import type { HttpClient } from '../../core/http-client'
import type { ZitadelMachineUserIdpsListGetDto } from '../../dtos'
import type { ZitadelMachineUserIdpsListGetResponse } from '../../responses'

export class IdpService {
  constructor(private httpClient: HttpClient) { }

  /**
   * Returns a list of links to an identity provider of an user.
   *
   * @param {string} userId - The ID of the user whose links are being retrieved.
   * @param {ZitadelMachineUserIdpsListGetDto} dto - The DTO containing query parameters for the link list retrieval.
   * @returns {Promise<ZitadelMachineUserIdpsListGetResponse>} The response containing the list of user links.
   * @throws {Error} If the request failed.
   */
  async list(
    userId: string,
    dto: ZitadelMachineUserIdpsListGetDto,
  ): Promise<ZitadelMachineUserIdpsListGetResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/links/_search`

    const response: ZitadelMachineUserIdpsListGetResponse = await this.httpClient.client.post(url, {
      json: dto,
    }).json()

    return response
  }
}
