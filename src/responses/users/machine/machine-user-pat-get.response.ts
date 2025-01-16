import { z } from 'zod'
import { DetailsSchema } from '../../common'

export const TokenSchema = z.object({
  id: z.string(),
  details: DetailsSchema,
  expirationDate: z.string(),
  scopes: z.array(z.string()),
})

export const ZitadelMachineUserPatGetResponseSchema = z.object({
  token: TokenSchema,
})

export type Token = z.infer<typeof TokenSchema>
export type ZitadelMachineUserPatGetResponse = z.infer<typeof ZitadelMachineUserPatGetResponseSchema>
