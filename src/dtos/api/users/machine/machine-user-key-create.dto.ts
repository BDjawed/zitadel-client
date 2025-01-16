import { z } from 'zod'
import { ZitadelMachineUserKeyType } from '../../../../responses'
import { ZitadelOrganizationIdHeaderSchema } from '../../common'

export const ZitadelMachineUserKeyCreateHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserKeyCreateHeaderDto = z.infer<typeof ZitadelMachineUserKeyCreateHeaderSchema>

export const ZitadelMachineUserKeyCreatePathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelMachineUserKeyCreatePathDto = z.infer<typeof ZitadelMachineUserKeyCreatePathSchema>

export const ZitadelMachineUserKeyCreateSchema = z.object({
  type: z.nativeEnum(ZitadelMachineUserKeyType),
  expirationDate: z.date(),
  publicKey: z.string().optional(),
})

export type ZitadelMachineUserKeyCreateDto = z.infer<typeof ZitadelMachineUserKeyCreateSchema>
