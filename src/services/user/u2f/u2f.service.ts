import { ApiEndpointsV2 } from '../../../enums'
import type { HttpClient } from '../../../core/http-client'
import type { ZitadelUserU2fDeletePathDto } from '../../../dtos'
import type { ZitadelUserU2fDeleteResponse } from '../../../responses'

export class U2fService {
  constructor(private httpClient: HttpClient) { }

  /**
   * Deletes a U2F token for a user.
   *
   * Removes the specified U2F token from the user.
   *
   * @param {ZitadelUserU2fDeletePathDto} pathDto - The DTO containing the user ID and U2F token ID.
   * @returns {Promise<ZitadelUserU2fDeleteResponse>} A promise that resolves to the response indicating the result of the U2F token deletion.
   * @throws {Error} Thrown if the request fails.
   */
  async deleteToken(
    pathDto: ZitadelUserU2fDeletePathDto,
  ): Promise<ZitadelUserU2fDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/u2f/${pathDto.u2fId}`

    const response: ZitadelUserU2fDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }
}
