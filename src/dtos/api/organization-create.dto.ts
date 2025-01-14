import type { Email, HashedPassword, IdpLink, Metadata, Password, Phone, Profile } from '.'

export interface ZitadelOrganizationCreateDto {
  name: string
  admins?: Admins[]
}

interface Admins {
  userId?: string
  human?: Human
  roles?: string[]
}

interface Human {
  userId?: string
  username?: string
  organization?: Organization
  profile: Profile
  email: Email
  phone?: Phone
  metadata?: Metadata
  password?: Password
  hashedPassword?: HashedPassword
  idpLinks?: IdpLink[]
  totpSecret?: string
}

interface Organization {
  orgId?: string
  orgDomain?: string
}
