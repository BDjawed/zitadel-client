import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from './common'

export const ZitadelMachineUserPatGetHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserPatGetHeaderDto = z.infer<typeof ZitadelMachineUserPatGetHeaderSchema>

export const ZitadelMachineUserPatGetPathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
  tokenId: z.string().min(1, 'Token ID is required'),
})

export type ZitadelMachineUserPatGetPathDto = z.infer<typeof ZitadelMachineUserPatGetPathSchema>
