import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelAppClientSecretCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelAppClientSecretCreatePathDto {
  appId: string
  projectId: string
}
