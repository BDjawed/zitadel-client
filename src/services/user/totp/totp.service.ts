import { ApiEndpointsV2 } from '../../../enums'
import type { HttpClient } from '../../../core/http-client'
import type { ZitadelUserTotpDeleteResponse } from '../../../responses'

export class TotpService {
  constructor(private httpClient: HttpClient) { }

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
  async delete(
    userId: string,
  ): Promise<ZitadelUserTotpDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/totp`

    const response: ZitadelUserTotpDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }
}
