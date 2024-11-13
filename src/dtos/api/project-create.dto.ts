import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelProjectCreateDto {
  name: string
  projectRoleAssertion: boolean
  projectRoleCheck: boolean
  hasProjectCheck: boolean
  privateLabelingSetting: ZitadelProjectPrivateLabelingSetting
}

export enum ZitadelProjectPrivateLabelingSetting {
  UNSPECIFIED = 'PRIVATE_LABELING_SETTING_UNSPECIFIED',
  ENFORCE_PROJECT_RESOURCE_OWNER_POLICY = 'PRIVATE_LABELING_SETTING_ENFORCE_PROJECT_RESOURCE_OWNER_POLICY',
  ALLOW_LOGIN_USER_RESOURCE_OWNER_POLICY = 'PRIVATE_LABELING_SETTING_ALLOW_LOGIN_USER_RESOURCE_OWNER_POLICY',
}

export interface ZitadelProjectCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}
