import jwt from 'jsonwebtoken'
import type { ZitadelJwtAssertionCreateDto } from '../dtos'

export function generateAssertion(dto: ZitadelJwtAssertionCreateDto): string {
  const payload = {
    iss: dto.issuer,
    sub: dto.subject,
    aud: dto.audience,
    exp: Math.floor(Date.now() / 1000) + 15 * 60,
    iat: Math.floor(Date.now() / 1000),
  }

  const header = {
    alg: 'RS256',
    kid: dto.keyId,
  }

  return jwt.sign(payload, dto.key, {
    algorithm: 'RS256',
    header,
  })
}
