import { z } from 'zod'
import { ZitadelOrganizationIdHeaderSchema } from '../common'

export enum ZitadelAppOidcResponseType {
  CODE = 'OIDC_RESPONSE_TYPE_CODE',
  ID_TOKEN = 'OIDC_RESPONSE_TYPE_ID_TOKEN',
  ID_TOKEN_TOKEN = 'OIDC_RESPONSE_TYPE_ID_TOKEN_TOKEN',
}

export enum ZitadelAppOidcGrantType {
  AUTHORIZATION_CODE = 'OIDC_GRANT_TYPE_AUTHORIZATION_CODE',
  IMPLICIT = 'OIDC_GRANT_TYPE_IMPLICIT',
  REFRESH_TOKEN = 'OIDC_GRANT_TYPE_REFRESH_TOKEN',
  DEVICE_CODE = 'OIDC_GRANT_TYPE_DEVICE_CODE',
  TOKEN_EXCHANGE = 'OIDC_GRANT_TYPE_TOKEN_EXCHANGE',
}

export enum ZitadelAppOidcAppType {
  WEB = 'OIDC_APP_TYPE_WEB',
  USER_AGENT = 'OIDC_APP_TYPE_USER_AGENT',
  NATIVE = 'OIDC_APP_TYPE_NATIVE',
}

export enum ZitadelAppOidcAuthMethodType {
  BASIC = 'OIDC_AUTH_METHOD_TYPE_BASIC',
  POST = 'OIDC_AUTH_METHOD_TYPE_POST',
  NONE = ' OIDC_AUTH_METHOD_TYPE_NONE',
  PRIVATE_KEY_JWT = 'OIDC_AUTH_METHOD_TYPE_PRIVATE_KEY_JWT',
}

export enum ZitadelAppOidcVersionType {
  '1_0' = 'OIDC_VERSION_1_0',
}

export enum ZitadelAppOidcAccessTokenType {
  BEARER = 'OIDC_TOKEN_TYPE_BEARER',
  JWT = 'OIDC_TOKEN_TYPE_JWT',
}

export const ZitadelAppOidcCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  redirectUris: z.array(z.string()),
  responseTypes: z.array(z.nativeEnum(ZitadelAppOidcResponseType)),
  grantTypes: z.array(z.nativeEnum(ZitadelAppOidcGrantType)),
  appType: z.nativeEnum(ZitadelAppOidcAppType),
  authMethodType: z.nativeEnum(ZitadelAppOidcAuthMethodType),
  postLogoutRedirectUris: z.array(z.string()),
  version: z.nativeEnum(ZitadelAppOidcVersionType),
  devMode: z.boolean(),
  accessTokenType: z.nativeEnum(ZitadelAppOidcAccessTokenType),
  accessTokenRoleAssertion: z.boolean(),
  idTokenRoleAssertion: z.boolean(),
  idTokenUserinfoAssertion: z.boolean(),
  clockSkew: z.string(),
  additionalOrigins: z.array(z.string()),
  skipNativeAppSuccessPage: z.boolean(),
  backChannelLogoutUri: z.array(z.string()),
})

export type ZitadelAppOidcCreateDto = z.infer<typeof ZitadelAppOidcCreateSchema>

export const ZitadelAppOidcCreateHeaderSchema = ZitadelOrganizationIdHeaderSchema.extend({})

export type ZitadelAppOidcCreateHeaderDto = z.infer<typeof ZitadelAppOidcCreateHeaderSchema>

export const ZitadelAppOidcCreatePathSchema = z.object({
  projectId: z.string(),
})

export type ZitadelAppOidcCreatePathDto = z.infer<typeof ZitadelAppOidcCreatePathSchema>
