import { ApiEndpointsV1, UsersEndpointsV1 } from '../../../enums'
import { KeyMachineService } from '../key/key.service'
import { PatMachineService } from '../pat/pat.machine.service'
import { SecretService } from '../secret/secret.service'
import type { HttpClient } from '../../../core/http-client'
import type { ZitadelMachineUserCreateDto, ZitadelMachineUserUpdateDto } from '../../../dtos'
import type { ZitadelMachineUserCreateResponse, ZitadelMachineUserUpdateResponse } from '../../../responses'

export class UserMachineService {
  private keyService: KeyMachineService
  private patService: PatMachineService
  private secretService: SecretService
  constructor(private httpClient: HttpClient) {
    this.keyService = new KeyMachineService(this.httpClient)
    this.patService = new PatMachineService(this.httpClient)
    this.secretService = new SecretService(this.httpClient)
  }

  get key(): KeyMachineService {
    return this.keyService
  }

  get pat(): PatMachineService {
    return this.patService
  }

  get secret(): SecretService {
    return this.secretService
  }

  /**
   * Creates a new machine user.
   * The machine user is created using the provided machine user create DTO.
   * Create a new user with the type machine for your API, service or device.
   * These users are used for non-interactive authentication flows.
   *
   * @param {ZitadelMachineUserCreateDto} dto - The machine user create DTO.
   * @param {string} orgId - The ID of the organization
   * @returns {Promise<ZitadelMachineUserCreateResponse>} The machine user create response.
   * @throws {Error} If the request failed.
   */
  async create(
    dto: ZitadelMachineUserCreateDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const response: ZitadelMachineUserCreateResponse = await this.httpClient.client.post(ApiEndpointsV1.MACHINE_USERS, {
      json: dto,
      headers,
    }).json()

    return response
  }

  /**
   * Update a machine user.
   *
   * Change a service account/machine user. It is used for accounts with non-interactive authentication possibilities.
   *
   * @param {string} userId - The ID of the machine user to update.
   * @param {ZitadelMachineUserUpdateDto} dto - The machine user update DTO.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelMachineUserUpdateResponse>} A promise that resolves to the response containing the updated machine user.
   * @throws {Error} Thrown if the request fails.
   */
  async update(
    userId: string,
    dto: ZitadelMachineUserUpdateDto,
    orgId?: string,
  ): Promise<ZitadelMachineUserUpdateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const url = `${UsersEndpointsV1.MACHINE_USER.replace(':userId', userId)}`

    const response: ZitadelMachineUserUpdateResponse = await this.httpClient.client.put(url, {
      json: dto,
      headers,
    }).json()

    return response
  }
}
