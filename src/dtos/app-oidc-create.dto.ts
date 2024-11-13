import type { ZitadelOrganizationIdHeaderDto } from './common'

export interface ZitadelAppOidcCreateDto {
  name: string
  redirectUris: string[]
  responseTypes: ZitadelAppOidcResponseType[]
  grantTypes: ZitadelAppOidcGrantType[]
  appType: ZitadelAppOidcAppType
  authMethodType: ZitadelAppOidcAuthMethodType
  postLogoutRedirectUris: string[]
  version: ZitadelAppOidcVersionType
  devMode: boolean
  accessTokenType: ZitadelAppOidcAccessTokenType
  accessTokenRoleAssertion: boolean
  idTokenRoleAssertion: boolean
  idTokenUserinfoAssertion: boolean
  clockSkew: string
  additionalOrigins: string[]
  skipNativeAppSuccessPage: boolean
  backChannelLogoutUri: string[]
}

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

export interface ZitadelAppOidcCreateHeaderDto extends ZitadelOrganizationIdHeaderDto {}

export interface ZitadelAppOidcCreatePathDto {
  projectId: string
}
