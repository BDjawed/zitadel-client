import type { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from '../..'

export const ZitadelMachineUserUpdateResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({})

export type ZitadelMachineUserUpdateResponse = z.infer<typeof ZitadelMachineUserUpdateResponseSchema>
