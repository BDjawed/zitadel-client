import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelUserHistoryPostBodyDto {
  sequence: string
  limit: number
  asc: boolean
}
export interface ZitadelUserHistoryPostDto {
  query: ZitadelUserHistoryPostBodyDto
}

export interface ZitadelUserHistoryPostHeaderDto extends ZitadelOrganizationIdHeaderDto { }

export interface ZitadelUserHistoryPostPathDto {
  userId: string
}
