import { ApiEndpointsV1 } from '../../enums'
import type { HttpClient } from '../../core/http-client'
import type { ZitadelProjectCreateDto } from '../../dtos'
import type { ZitadelProjectCreateResponse } from '../../responses'

export class ProjectService {
  constructor(private httpClient: HttpClient) { }

  /**
   * Create a new project.
   *
   * A Project is a vessel for different applications sharing the same role context.
   *
   * @param {ZitadelProjectCreateDto} dto - The project create DTO.
   * @param {string} [orgId] - Optional organization ID to include in the request headers.
   * @returns {Promise<ZitadelProjectCreateResponse>} The project create response.
   * @throws {Error} If the request failed.
   */
  async create(
    dto: ZitadelProjectCreateDto,
    orgId?: string,
  ): Promise<ZitadelProjectCreateResponse> {
    const headers = orgId ? { 'x-zitadel-orgid': orgId } : {}

    const response: ZitadelProjectCreateResponse = await this.httpClient.client.post(ApiEndpointsV1.PROJECTS, {
      json: dto,
      headers,
    }).json()

    return response
  }
}
