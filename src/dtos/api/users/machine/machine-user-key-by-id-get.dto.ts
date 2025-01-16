import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../../common'

export const ZitadelMachineUserKeyByIdGetHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserKeyByIdGetHeaderDto = z.infer<typeof ZitadelMachineUserKeyByIdGetHeaderSchema>

export const ZitadelMachineUserKeyByIdGetPathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
  keyId: z.string().min(1, 'Key ID is required'),
})

export type ZitadelMachineUserKeyByIdGetPathDto = z.infer<typeof ZitadelMachineUserKeyByIdGetPathSchema>
