import { ApiEndpointsV1, ApiEndpointsV2 } from '../../enums'
import type { HttpClient } from '../../core/http-client'
import type { ZitadelOrganizationCreateDto } from '../../dtos'
import type { ZitadelOrganizationCreateResponse, ZitadelOrganizationDeleteResponse } from '../../responses'

export class OrganizationService {
  constructor(private httpClient: HttpClient) {}

  async create(dto: ZitadelOrganizationCreateDto): Promise<ZitadelOrganizationCreateResponse> {
    return this.httpClient.client.post(ApiEndpointsV2.ORGANIZATIONS, {
      json: dto,
    }).json()
  }

  async delete(orgId: string): Promise<ZitadelOrganizationDeleteResponse> {
    return this.httpClient.client.delete(ApiEndpointsV1.ORGANIZATION, {
      headers: {
        'x-zitadel-orgid': orgId,
      },
    }).json()
  }
}
