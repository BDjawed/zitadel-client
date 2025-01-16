import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../../common'

export const ZitadelMachineUserSecretDeleteHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserSecretDeleteHeaderDto = z.infer<typeof ZitadelMachineUserSecretDeleteHeaderSchema>

export const ZitadelMachineUserSecretDeletePathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelMachineUserSecretDeletePathDto = z.infer<typeof ZitadelMachineUserSecretDeletePathSchema>
