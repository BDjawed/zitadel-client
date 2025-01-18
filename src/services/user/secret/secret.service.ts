import { UsersEndpointsV1 } from '../../../enums'
import type { HttpClient } from '../../../core/http-client'
import type { ZitadelMachineUserSecretCreateResponse, ZitadelMachineUserSecretDeleteResponse } from '../../../responses'

export class SecretService {
  constructor(private httpClient: HttpClient) { }

  /**
   * Creates a secret for a machine user.
   *
   * Create a new secret for a machine user/service account.
   *  It is used to authenticate the user (client credential grant).
   *
   * @param {string} userId - The ID of the user to create the secret for.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelMachineUserSecretCreateResponse>} A promise that resolves to the response containing the created secret.
   * @throws {Error} Thrown if the request fails.
   */
  async create(
    userId: string,
    orgId?: string,
  ): Promise<ZitadelMachineUserSecretCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', userId)}/secret`

    const response: ZitadelMachineUserSecretCreateResponse = await this.httpClient.client.put(url, {
      headers,
    }).json()

    return response
  }

  /**
   * Deletes the secret of a machine user.
   *
   * Delete a secret of a machine user/service account.
   * The user will not be able to authenticate with the secret afterward.
   *
   * @param {string} userId - The ID of the machine user to delete the secret for.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelMachineUserSecretDeleteResponse>} A promise that resolves to the response containing the deleted secret.
   * @throws {Error} Thrown if the request fails.
   */
  async delete(
    userId: string,
    orgId?: string,
  ): Promise<ZitadelMachineUserSecretDeleteResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.USER.replace(':userId', userId)}/secret`

    const response: ZitadelMachineUserSecretDeleteResponse = await this.httpClient.client.delete(url, {
      headers,
    }).json()

    return response
  }
}
