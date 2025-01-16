import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../../common'

export const ZitadelMachineUserPatCreateSchema = z.object({
  expirationDate: z.date(),
})

export type ZitadelMachineUserPatCreateDto = z.infer<typeof ZitadelMachineUserPatCreateSchema>

export const ZitadelMachineUserPatCreateHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserPatCreateHeaderDto = z.infer<typeof ZitadelMachineUserPatCreateHeaderSchema>

export const ZitadelMachineUserPatCreatePathSchema = z.object({
  userId: z.string().min(1, 'User  ID is required'),
})

export type ZitadelMachineUserPatCreatePathDto = z.infer<typeof ZitadelMachineUserPatCreatePathSchema>
