import { z } from 'zod'
import {
  ZitadelTextQueryMethod,
  ZitadelUsersSearchSortingColumn,
  ZitadelUserStateType,
  ZitadelUserType,
} from '../../../enums'

// Individual query interfaces
export const UserNameQuerySchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  method: z.nativeEnum(ZitadelTextQueryMethod),
})

export type UserNameQuery = z.infer<typeof UserNameQuerySchema>

export const FirstNameQuerySchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  method: z.nativeEnum(ZitadelTextQueryMethod),
})

export type FirstNameQuery = z.infer<typeof FirstNameQuerySchema>

export const LastNameQuerySchema = z.object({
  lastName: z.string().min(1, 'Last name is required'),
  method: z.nativeEnum(ZitadelTextQueryMethod),
})

export type LastNameQuery = z.infer<typeof LastNameQuerySchema>

export const NickNameQuerySchema = z.object({
  nickName: z.string().min(1, 'Nickname is required'),
  method: z.nativeEnum(ZitadelTextQueryMethod),
})

export type NickNameQuery = z.infer<typeof NickNameQuerySchema>

export const DisplayNameQuerySchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  method: z.nativeEnum(ZitadelTextQueryMethod),
})

export type DisplayNameQuery = z.infer<typeof DisplayNameQuerySchema>

export const EmailQuerySchema = z.object({
  emailAddress: z.string().min(1, 'Email address is required'),
  method: z.nativeEnum(ZitadelTextQueryMethod),
})

export type EmailQuery = z.infer<typeof EmailQuerySchema>

export const StateQuerySchema = z.object({
  state: z.nativeEnum(ZitadelUserStateType),
})

export type StateQuery = z.infer<typeof StateQuerySchema>

export const TypeQuerySchema = z.object({
  type: z.nativeEnum(ZitadelUserType),
})

export type TypeQuery = z.infer<typeof TypeQuerySchema>

export const LoginNameQuerySchema = z.object({
  loginName: z.string().min(1, 'Login name is required'),
  method: z.nativeEnum(ZitadelTextQueryMethod),
})

export type LoginNameQuery = z.infer<typeof LoginNameQuerySchema>

export const InUserIdsQuerySchema = z.object({
  userIds: z.array(z.string().min(1, 'User  ID is required')),
})

export type InUserIdsQuery = z.infer<typeof InUserIdsQuerySchema>

export const InUserEmailsQuerySchema = z.object({
  userEmails: z.array(z.string().min(1, 'User  email is required')),
})

export type InUserEmailsQuery = z.infer<typeof InUserEmailsQuerySchema>

export const OrQuerySchema = z.object({
  queries: z.array(z.unknown()),
})

export type OrQuery = z.infer<typeof OrQuerySchema>

export const AndQuerySchema = z.object({
  queries: z.array(z.unknown()),
})

export type AndQuery = z.infer<typeof AndQuerySchema>

export const NotQuerySchema = z.object({
  query: z.unknown(),
})

export type NotQuery = z.infer<typeof NotQuerySchema>

export const OrganizationIdQuerySchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
})

export type OrganizationIdQuery = z.infer<typeof OrganizationIdQuerySchema>

// Union type for all possible queries
export const ZitadelUserQuerySchema = z.union([
  z.object({ userNameQuery: UserNameQuerySchema }),
  z.object({ firstNameQuery: FirstNameQuerySchema }),
  z.object({ lastNameQuery: LastNameQuerySchema }),
  z.object({ nickNameQuery: NickNameQuerySchema }),
  z.object({ displayNameQuery: DisplayNameQuerySchema }),
  z.object({ emailQuery: EmailQuerySchema }),
  z.object({ stateQuery: StateQuerySchema }),
  z.object({ typeQuery: TypeQuerySchema }),
  z.object({ loginNameQuery: LoginNameQuerySchema }),
  z.object({ inUserIdsQuery: InUserIdsQuerySchema }),
  z.object({ orQuery: OrQuerySchema }),
  z.object({ andQuery: AndQuerySchema }),
  z.object({ notQuery: NotQuerySchema }),
  z.object({ inUserEmailsQuery: InUserEmailsQuerySchema }),
  z.object({ organizationIdQuery: OrganizationIdQuerySchema }),
])

export type ZitadelUserQuery = z.infer<typeof ZitadelUserQuerySchema>

// Main UsersSearch DTO interface
export const ZitadelUsersSearchSchema = z.object({
  query: z.object({
    offset: z.string().min(1, 'Offset is required'),
    limit: z.number().min(1, 'Limit is required'),
    asc: z.boolean(),
  }),
  sortingColumn: z.nativeEnum(ZitadelUsersSearchSortingColumn),
  queries: z.array(ZitadelUserQuerySchema),
})

export type ZitadelUsersSearchDto = z.infer<typeof ZitadelUsersSearchSchema>
