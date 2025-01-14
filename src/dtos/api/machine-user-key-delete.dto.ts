import type { z } from 'zod'
import { ZitadelMachineUserKeyByIdGetPathSchema } from '.'
import { ZitadelOrganizationIdHeaderSchema } from './common'

export const ZitadelMachineUserKeyDeleteHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelMachineUserKeyDeleteHeaderDto = z.infer<typeof ZitadelMachineUserKeyDeleteHeaderSchema>

export const ZitadelMachineUserKeyDeletePathSchema = ZitadelMachineUserKeyByIdGetPathSchema.extend({})

export type ZitadelMachineUserKeyDeletePathDto = z.infer<typeof ZitadelMachineUserKeyDeletePathSchema>
