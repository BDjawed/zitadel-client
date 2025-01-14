import { z } from 'zod'
import { ZitadelUsersSearchSortingColumn, ZitadelUserStateType } from '../enums'
import { DetailsSchema } from './common'
import { ZitadelHumanUserSchema, ZitadelMachineUserSchema } from './user-by-id-get.response'

export const ZitadelUserSchema = z.object({
  userId: z.string(),
  details: DetailsSchema,
  state: z.nativeEnum(ZitadelUserStateType),
  userName: z.string(),
  loginNames: z.array(z.string()),
  preferredLoginName: z.string(),
  human: ZitadelHumanUserSchema,
  machine: ZitadelMachineUserSchema,
})

export const ZitadelUsersSearchPostResponseSchema = z.object({
  details: z.object({
    totalResult: z.string(),
    processedSequence: z.string(),
    timestamp: z.date(),
  }),
  sortingColumn: z.nativeEnum(ZitadelUsersSearchSortingColumn),
  result: z.array(ZitadelUserSchema),
})

export type ZitadelUser = z.infer<typeof ZitadelUserSchema>
export type ZitadelUsersSearchPostResponse = z.infer<typeof ZitadelUsersSearchPostResponseSchema>
