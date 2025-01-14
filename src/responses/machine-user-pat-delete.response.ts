import type { z } from 'zod'
import { ZitadelLoginSettingsUpdateResponseSchema } from '.'

export const ZitadelMachineUserPatDeleteResponseSchema = ZitadelLoginSettingsUpdateResponseSchema.extend({})

export type ZitadelMachineUserPatDeleteResponse = z.infer<typeof ZitadelMachineUserPatDeleteResponseSchema>
