import type { ZitadelUserMetadataByKeyGetDto, ZitadelUserMetadataByKeyGetHeaderDto } from './user-metadata-by-key-get.dto'

export interface ZitadelUserMetadataByKeyCreateDto extends ZitadelUserMetadataByKeyGetDto {
  value: string
}

export interface ZitadelUserMetadataByKeyCreateHeaderDto extends ZitadelUserMetadataByKeyGetHeaderDto {}
