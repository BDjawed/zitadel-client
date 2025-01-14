import { z } from 'zod'
import { ZitadelMachineUserAccessTokenType } from '.'
import { ZitadelOrganizationIdHeaderSchema } from './common'

export const ZitadelMachineUserUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  accessTokenType: z.nativeEnum(ZitadelMachineUserAccessTokenType),
})

export type ZitadelMachineUserUpdateDto = z.infer<typeof ZitadelMachineUserUpdateSchema>

export const ZitadelMachineUserUpdatePathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelMachineUserUpdatePathDto = z.infer<typeof ZitadelMachineUserUpdatePathSchema>

export const ZitadelMachineUserUpdateHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserUpdateHeaderDto = z.infer<typeof ZitadelMachineUserUpdateHeaderSchema>
