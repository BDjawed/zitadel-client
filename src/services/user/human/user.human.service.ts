import { ApiEndpointsV2 } from '../../../enums'
import { IdpService } from '../../idp/idp.service'
import type { HttpClient } from '../../../core/http-client'
import type { ZitadelHumanUserCreateDto, ZitadelHumanUserUpdateDto } from '../../../dtos'
import type { ZitadelHumanUserCreateResponse, ZitadelHumanUserUpdateResponse } from '../../../responses'

export class UserHumanService {
  private idpService: IdpService
  constructor(private httpClient: HttpClient) {
    this.idpService = new IdpService(httpClient)
  }

  get idp(): IdpService {
    return this.idpService
  }

  /**
   * Creates a new human user.
   * The human user is created using the provided human user create DTO.
   * Create/import a new user with the type human.
   * The newly created user will get a verification email if either the email address is not marked as verified
   * and you did not request the verification to be returned.
   *
   * @param {ZitadelHumanUserCreateDto} dto - The human user create DTO.
   * @returns {Promise<ZitadelHumanUserCreateResponse>} The human user create response.
   * @throws {Error} If the request failed.
   */
  async create(dto: ZitadelHumanUserCreateDto): Promise<ZitadelHumanUserCreateResponse> {
    const response: ZitadelHumanUserCreateResponse = await this.httpClient.client.post(ApiEndpointsV2.HUMAN_USERS.replace('/:userId', ''), {
      json: dto,
    }).json()

    return response
  }

  /**
   * Update a human user.
   *
   * Update all information from a user..
   *
   * @param {string} userId - The ID of the human user to update.
   * @param {ZitadelHumanUserUpdateDto} dto - The human user update DTO.
   * @returns {Promise<ZitadelHumanUserUpdateResponse>} A promise that resolves to the response containing the updated human user.
   * @throws {Error} Thrown if the request fails.
   */
  async update(
    userId: string,
    dto: ZitadelHumanUserUpdateDto,
  ): Promise<ZitadelHumanUserUpdateResponse> {
    const url = `${ApiEndpointsV2.HUMAN_USERS.replace(':userId', userId)}`

    const response: ZitadelHumanUserUpdateResponse = await this.httpClient.client.put(url, {
      json: dto,
    }).json()

    return response
  }
}
