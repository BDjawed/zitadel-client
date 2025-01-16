import { z } from 'zod'

export enum ZitadelUserGender {
  MALE = 'GENDER_MALE',
  FEMAL = 'GENDER_FEMALE',
  DIVERSE = 'GENDER_DIVERSE',
  UNSPECIFIED = 'GENDER_UNSPECIFIED',
}

export const ZitadelOrganizationIdHeaderSchema = z.object({
  'x-zitadel-orgid': z.string(),
})

export type ZitadelOrganizationIdHeaderDto = z.infer<typeof ZitadelOrganizationIdHeaderSchema>

export const OrganizationSchema = z.object({
  orgId: z.string().optional(),
  orgDomain: z.string().optional(),
})

export type Organization = z.infer<typeof OrganizationSchema>

export const ProfileSchema = z.object({
  givenName: z.string().min(1, 'Given name is required'),
  familyName: z.string().min(1, 'Family name is required'),
  nickName: z.string().optional(),
  displayName: z.string().optional(),
  preferredLanguage: z.string().optional(),
  gender: z.nativeEnum(ZitadelUserGender).optional(),
})

export type Profile = z.infer<typeof ProfileSchema>

export const PasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  changeRequired: z.boolean().optional(),
})

export type Password = z.infer<typeof PasswordSchema>

export const HashedPasswordSchema = z.object({
  hash: z.string().min(1, 'Hash is required'),
  changeRequired: z.boolean().optional(),
})

export type HashedPassword = z.infer<typeof HashedPasswordSchema>

export const SendCodeSchema = z.object({
  urlTemplate: z.string().min(1, 'Url template is required'),
})

export type SendCode = z.infer<typeof SendCodeSchema>

export const EmailSchema = z.object({
  email: z.string().email('Email must be a valid email address'),
  sendCode: SendCodeSchema.optional(),
  returnCode: z.object({}).optional(),
  isVerified: z.boolean().optional(),
})

export type Email = z.infer<typeof EmailSchema>

export const PhoneSchema = z.object({
  phone: z.string().optional(),
  sendCode: z.object({}).optional(),
  returnCode: z.object({}).optional(),
  isVerified: z.boolean().optional(),
})

export type Phone = z.infer<typeof PhoneSchema>

export const MetadataSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
})

export type Metadata = z.infer<typeof MetadataSchema>

export const IdpLinkSchema = z.object({
  idpId: z.string().optional(),
  userId: z.string().optional(),
  userName: z.string().optional(),
})

export type IdpLink = z.infer<typeof IdpLinkSchema>
