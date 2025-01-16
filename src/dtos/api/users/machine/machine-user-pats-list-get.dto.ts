import { z } from 'zod'
import { QuerySchema } from '../..'
import { ZitadelOrganizationIdHeaderSchema } from '../../common'

export const ZitadelMachineUserPatsListGetHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserPatsListGetHeaderDto = z.infer<typeof ZitadelMachineUserPatsListGetHeaderSchema>

export const ZitadelMachineUserPatsListGetPathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelMachineUserPatsListGetPathDto = z.infer<typeof ZitadelMachineUserPatsListGetPathSchema>

export const ZitadelMachineUserPatsListGetSchema = QuerySchema.extend({})

export type ZitadelMachineUserPatsListGetDto = z.infer<typeof ZitadelMachineUserPatsListGetSchema>
