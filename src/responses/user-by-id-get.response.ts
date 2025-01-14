import { z } from 'zod'
import { ZitadelMachineUserAccessTokenType, ZitadelUserGender } from '../dtos'
import { ZitadelUserStateType } from '../enums'
import { DetailsSchema } from './common'

export const ZitadelHumanUserSchema = z.object({
  userId: z.string(),
  state: z.nativeEnum(ZitadelUserStateType),
  userName: z.string(),
  loginNames: z.array(z.string()),
  preferredLoginName: z.string(),
  profile: z.object({
    givenName: z.string(),
    familyName: z.string(),
    nickName: z.string(),
    displayName: z.string(),
    preferredLanguage: z.string(),
    gender: z.nativeEnum(ZitadelUserGender),
    avatarUrl: z.string(),
  }),
  email: z.object({
    email: z.string(),
    isEmailVerified: z.boolean(),
  }),
  phone: z.object({
    phone: z.string(),
    isVerified: z.boolean(),
  }),
  passwordChangeRequired: z.boolean(),
  passwordChanged: z.date(),
})

export const ZitadelMachineUserSchema = z.object({
  name: z.string(),
  description: z.string(),
  hasSecret: z.boolean(),
  accessTokenType: z.nativeEnum(ZitadelMachineUserAccessTokenType),
})

export const ZitadelUserByIdGetResponseSchema = z.object({
  details: DetailsSchema,
  user: z.object({
    userId: z.string(),
    details: DetailsSchema,
    state: z.nativeEnum(ZitadelUserStateType),
    userName: z.string(),
    loginNames: z.array(z.string()),
    preferredLoginName: z.string(),
    human: ZitadelHumanUserSchema,
    machine: ZitadelMachineUserSchema,
  }),
})

export type ZitadelHumanUserDto = z.infer<typeof ZitadelHumanUserSchema>
export type ZitadelMachineUserDto = z.infer<typeof ZitadelMachineUserSchema>
export type ZitadelUserByIdGetResponse = z.infer<typeof ZitadelUserByIdGetResponseSchema>
