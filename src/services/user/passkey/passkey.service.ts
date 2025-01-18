import { ApiEndpointsV2 } from '../../../enums'
import type { HttpClient } from '../../../core/http-client'
import type { ZitadelUserPasskeyDeletePathDto, ZitadelUserPasskeyLinkRegistrationPostDto, ZitadelUserPasskeyRegisterPostDto } from '../../../dtos'
import type { ZitadelUserPasskeyDeleteResponse, ZitadelUserPasskeyLinkRegistrationPostResponse, ZitadelUserPasskeyRegisterPostResponse, ZitadelUserPasskeysGetResponse } from '../../../responses'

export class PasskeyService {
  constructor(private httpClient: HttpClient) { }

  /**
   * Retrieves a list of WebAuthn passkeys for the given user.
   *
   * @param {string} userId - The ID of the user whose passkeys are to be retrieved.
   * @returns {Promise<ZitadelUserPasskeysGetResponse>} A promise that resolves to the response containing the list of user passkeys.
   * @throws {Error} Thrown if the request fails.
   */
  async list(
    userId: string,
    // dto: ZitadelUserPasskeysGetDto,
  ): Promise<ZitadelUserPasskeysGetResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/passkeys/_search`

    const response: ZitadelUserPasskeysGetResponse = await this.httpClient.client.post(url, {
      json: {},
    }).json()

    return response
  }

  /**
   * Starts the registration of a WebAuthn passkey for a user.
   *
   * As a response the public key credential creation options are returned, which are used to verify the passkey..
   *
   * @param {string} userId - The ID of the user for whom the passkey registration is to be started.
   * @param {ZitadelUserPasskeyRegisterPostDto} dto - The DTO containing the details required for the passkey registration.
   * @returns {Promise<ZitadelUserPasskeyRegisterPostResponse>} A promise that resolves to the response containing the details of the registered passkey.
   * @throws {Error} Thrown if the request fails.
   */
  async register(
    userId: string,
    dto: ZitadelUserPasskeyRegisterPostDto,
  ): Promise<ZitadelUserPasskeyRegisterPostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/passkeys`

    const response: ZitadelUserPasskeyRegisterPostResponse = await this.httpClient.client.post(url, {
      json: dto,
    }).json()

    return response
  }

  /**
   * Creates a registration link for a WebAuthn passkey for a user.
   *
   * Create a passkey registration link which includes a code and either return it or send it to the user..
   *
   * @param {string} userId - The ID of the user for whom the passkey registration link is to be created.
   * @param {ZitadelUserPasskeyLinkRegistrationPostDto} dto - The DTO containing the details required for the passkey registration link.
   * @returns {Promise<ZitadelUserPasskeyLinkRegistrationPostResponse>} A promise that resolves to the response containing the passkey registration link.
   * @throws {Error} Thrown if the request fails.
   */
  async createRegistrationLink(
    userId: string,
    dto: ZitadelUserPasskeyLinkRegistrationPostDto,
  ): Promise<ZitadelUserPasskeyLinkRegistrationPostResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', userId)}/passkeys/registration_link`

    const response: ZitadelUserPasskeyLinkRegistrationPostResponse = await this.httpClient.client.post(url, {
      json: dto,
    }).json()

    return response
  }

  /**
   * Deletes a registered WebAuthn passkey for a user.
   *
   * Remove a registered passkey from a user.
   *
   * @param {ZitadelUserPasskeyDeletePathDto} pathDto - The DTO containing the user ID and passkey ID of the passkey to be deleted.
   * @returns {Promise<ZitadelUserPasskeyDeleteResponse>} A promise that resolves to the response containing the deleted passkey.
   * @throws {Error} Thrown if the request fails.
   */
  async delete(
    pathDto: ZitadelUserPasskeyDeletePathDto,
  ): Promise<ZitadelUserPasskeyDeleteResponse> {
    const url = `${ApiEndpointsV2.USERS.replace(':userId', pathDto.userId)}/passkeys/${pathDto.passkeyId}`

    const response: ZitadelUserPasskeyDeleteResponse = await this.httpClient.client.delete(url).json()

    return response
  }
}
