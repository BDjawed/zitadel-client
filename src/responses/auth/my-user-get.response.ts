import { z } from 'zod'
import { ZitadelMachineUserAccessTokenType, ZitadelUserGender } from '../../dtos'
import { ZitadelUserStateType } from '../../enums'
import { DetailsSchema } from '../common'

export const ProfileResponseSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  nickName: z.string(),
  displayName: z.string(),
  preferredLanguage: z.string(),
  gender: z.nativeEnum(ZitadelUserGender),
  avatarUrl: z.string(),
})

export const EmailResponseSchema = z.object({
  email: z.string(),
  isEmailVerified: z.boolean(),
})

export const PhoneResponseSchema = z.object({
  phone: z.string(),
  isPhoneVerified: z.boolean(),
})

export const HumanResponseSchema = z.object({
  profile: ProfileResponseSchema,
  emails: EmailResponseSchema,
  phones: PhoneResponseSchema,
  passwordChanged: z.date(),
})

export const MachineResponseSchema = z.object({
  name: z.string(),
  description: z.string(),
  hasSecret: z.boolean(),
  accessTokenType: z.nativeEnum(ZitadelMachineUserAccessTokenType),
})

export const ZitadelGetMyUserResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    detail: DetailsSchema,
    state: z.nativeEnum(ZitadelUserStateType),
    userName: z.string(),
    loginNames: z.array(z.string()),
    preferredLoginName: z.string(),
    human: HumanResponseSchema,
    machine: MachineResponseSchema,
  }),
  lastLogin: z.date(),
})

export type ZitadelMyUserGetResponse = z.infer<typeof ZitadelGetMyUserResponseSchema>
