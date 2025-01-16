import { z } from 'zod'
import { ZitadelMachineUserKeyType } from '../..'
import { DetailsSchema } from '../../common'

const ResultSchema = z.object({
  id: z.string(),
  details: DetailsSchema,
  type: z.nativeEnum(ZitadelMachineUserKeyType),
  expirationDate: z.string(),
})

export const ZitadelMachineUserKeysGetResponseSchema = z.object({
  result: z.array(ResultSchema),
})

// type Result = z.infer<typeof ResultSchema>
export type ZitadelMachineUserKeysGetResponse = z.infer<typeof ZitadelMachineUserKeysGetResponseSchema>
