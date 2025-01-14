import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from './common'

export const ZitadelMachineUserSecretCreateHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserSecretCreateHeaderDto = z.infer<typeof ZitadelMachineUserSecretCreateHeaderSchema>

export const ZitadelMachineUserSecretCreatePathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelMachineUserSecretCreatePathDto = z.infer<typeof ZitadelMachineUserSecretCreatePathSchema>

export const ZitadelMachineUserSecretCreateSchema = z.object({})

export type ZitadelMachineUserSecretCreateDto = z.infer<typeof ZitadelMachineUserSecretCreateSchema>
