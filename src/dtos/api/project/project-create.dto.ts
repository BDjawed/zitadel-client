import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../common'

export enum ZitadelProjectPrivateLabelingSetting {
  UNSPECIFIED = 'PRIVATE_LABELING_SETTING_UNSPECIFIED',
  ENFORCE_PROJECT_RESOURCE_OWNER_POLICY = 'PRIVATE_LABELING_SETTING_ENFORCE_PROJECT_RESOURCE_OWNER_POLICY',
  ALLOW_LOGIN_USER_RESOURCE_OWNER_POLICY = 'PRIVATE_LABELING_SETTING_ALLOW_LOGIN_USER_RESOURCE_OWNER_POLICY',
}

export const ZitadelProjectCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  projectRoleAssertion: z.boolean(),
  projectRoleCheck: z.boolean(),
  hasProjectCheck: z.boolean(),
  privateLabelingSetting: z.nativeEnum(ZitadelProjectPrivateLabelingSetting),
})

export type ZitadelProjectCreateDto = z.infer<typeof ZitadelProjectCreateSchema>

export const ZitadelProjectCreateHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelProjectCreateHeaderDto = z.infer<typeof ZitadelProjectCreateHeaderSchema>
