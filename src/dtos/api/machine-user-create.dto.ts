import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from './common'

export enum ZitadelMachineUserAccessTokenType {
  BEARER = 'ACCESS_TOKEN_TYPE_BEARER',
  JWT = 'ACCESS_TOKEN_TYPE_JWT',
}

export const ZitadelMachineUserCreateSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  accessTokenType: z.nativeEnum(ZitadelMachineUserAccessTokenType),
})

export type ZitadelMachineUserCreateDto = z.infer<typeof ZitadelMachineUserCreateSchema>

export const ZitadelMachineUserCreateHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserCreateHeaderDto = z.infer<typeof ZitadelMachineUserCreateHeaderSchema>
