import { z } from 'zod'
import { ZitadelUserStateType } from '../enums'
import { DetailsSchema } from './common'
import { ZitadelHumanUserSchema, ZitadelMachineUserSchema } from './user-by-id-get.response'

export const UserSchema = z.object({
  id: z.string(),
  details: DetailsSchema,
  state: z.nativeEnum(ZitadelUserStateType),
  userName: z.string(),
  loginNames: z.array(z.string()),
  preferredLoginName: z.string(),
  human: ZitadelHumanUserSchema,
  machine: ZitadelMachineUserSchema,
})

export const ZitadelUserByLoginNameGetResponseSchema = z.object({
  user: UserSchema,
})

export type User = z.infer<typeof UserSchema>
export type ZitadelUserByLoginNameGetResponse = z.infer<typeof ZitadelUserByLoginNameGetResponseSchema>
