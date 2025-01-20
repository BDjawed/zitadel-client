import { z } from 'zod'
import { PaginationQuerySchema } from '..'
import { ZitadelTextQueryMethod } from '../../../enums'
import { OrganizationState } from '../../../responses'

export const NameQuerySchema = z.object({
  name: z.string(),
  method: z.nativeEnum(ZitadelTextQueryMethod),
})

export const DomainQuerySchema = z.object({
  domain: z.string(),
  method: z.nativeEnum(ZitadelTextQueryMethod),
})

export const OrganizationStateQuerySchema = z.object({
  state: z.nativeEnum(OrganizationState),
})

export const IdQuerySchema = z.object({
  id: z.string(),
})

const ZitadelUserOrganizationQuerySchema = z.union([
  z.object({ nameQuery: NameQuerySchema }),
  z.object({ domainQuery: DomainQuerySchema }),
  z.object({ stateQuery: OrganizationStateQuerySchema }),
  z.object({ idQuery: IdQuerySchema }),
])

export enum ZitadelMeUsersSearchSortingColumn {
  UNSPECIFIED = 'ORG_FIELD_NAME_UNSPECIFIED',
  NAME = 'ORG_FIELD_NAME_NAME',
}

export const ZitadelUserOrganizationsPostBodySchema = z.object({
  query: PaginationQuerySchema,
  queries: z.array(ZitadelUserOrganizationQuerySchema),
  sortingColumn: z.nativeEnum(ZitadelMeUsersSearchSortingColumn),

})
export type ZitadelMyUserOrganizationsPostDto = z.infer<typeof ZitadelUserOrganizationsPostBodySchema>
