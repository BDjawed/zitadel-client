export interface ZitadelJwtAssertionCreateDto {
  issuer: string
  subject: string
  audience: string
  keyId: string
  key: string
}
