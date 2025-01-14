import { z } from 'zod'
import { DetailsSchema } from './common'

export enum ZitadelMachineUserKeyType {
  UNSPECIFIED = 'KEY_TYPE_UNSPECIFIED',
  JSON = 'KEY_TYPE_JSON',
}

export const KeySchema = z.object({
  id: z.string(),
  details: DetailsSchema,
  type: z.nativeEnum(ZitadelMachineUserKeyType),
  expirationDate: z.string(),
})

export const ZitadelMachineUserKeyByIdGetResponseSchema = z.object({
  key: KeySchema,
})

export type ZitadelMachineUserKeyByIdGetResponse = z.infer<typeof ZitadelMachineUserKeyByIdGetResponseSchema>
export type Key = z.infer<typeof KeySchema>
