import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from './common'

export const ZitadelMachineUserPatDeleteHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserPatDeleteHeaderDto = z.infer<typeof ZitadelMachineUserPatDeleteHeaderSchema>

export const ZitadelMachineUserPatDeletePathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
  tokenId: z.string().min(1, 'Token ID is required'),
})

export type ZitadelMachineUserPatDeletePathDto = z.infer<typeof ZitadelMachineUserPatDeletePathSchema>
