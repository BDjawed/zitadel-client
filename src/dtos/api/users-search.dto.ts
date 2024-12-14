import type {
  ZitadelSearchUsersSortingColumn,
  ZitadelTextQueryMethod,
  ZitadelUserStateType,
  ZitadelUserType,
} from '../../enums'
import type { ZitadelOrganizationIdHeaderDto } from './common'

// Individual query interfaces
interface UserNameQuery {
  userName: string
  method: ZitadelTextQueryMethod
}

interface FirstNameQuery {
  firstName: string
  method: ZitadelTextQueryMethod
}

interface LastNameQuery {
  lastName: string
  method: ZitadelTextQueryMethod
}

interface NickNameQuery {
  nickName: string
  method: ZitadelTextQueryMethod
}

interface DisplayNameQuery {
  displayName: string
  method: ZitadelTextQueryMethod
}

interface EmailQuery {
  emailAddress: string
  method: ZitadelTextQueryMethod
}

interface StateQuery {
  state: ZitadelUserStateType
}

interface TypeQuery {
  type: ZitadelUserType
}

interface LoginNameQuery {
  loginName: string
  method: ZitadelTextQueryMethod
}

interface InUserIdsQuery {
  userIds: string[]
}

interface InUserEmailsQuery {
  userEmails: string[]
}

interface OrQuery {
  queries: Array<ZitadelUserQuery>
}

interface AndQuery {
  queries: Array<ZitadelUserQuery>
}

interface NotQuery {
  query: ZitadelUserQuery
}

// Union type for all possible queries
interface ZitadelUserQuery {
  userNameQuery?: UserNameQuery
  firstNameQuery?: FirstNameQuery
  lastNameQuery?: LastNameQuery
  nickNameQuery?: NickNameQuery
  displayNameQuery?: DisplayNameQuery
  emailQuery?: EmailQuery
  stateQuery?: StateQuery
  typeQuery?: TypeQuery
  loginNameQuery?: LoginNameQuery
  inUserIdsQuery?: InUserIdsQuery
  orQuery?: OrQuery
  andQuery?: AndQuery
  notQuery?: NotQuery
  inUserEmailsQuery?: InUserEmailsQuery
}

// Main UsersSearch DTO interface
export interface ZitadelUsersSearchDto {
  query: {
    offset: string
    limit: number
    asc: boolean
  }
  sortingColumn: ZitadelSearchUsersSortingColumn
  queries: Array<ZitadelUserQuery>
}

export interface ZitadelUsersSearchHeaderDto
  extends ZitadelOrganizationIdHeaderDto {}
