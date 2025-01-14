import { z } from 'zod'

export const ZitadelWellKnownSchema = z.object({
  issuer: z.string(),
  authorization_endpoint: z.string(),
  token_endpoint: z.string(),
  introspection_endpoint: z.string(),
  userinfo_endpoint: z.string(),
  revocation_endpoint: z.string(),
  end_session_endpoint: z.string(),
  device_authorization_endpoint: z.string(),
  jwks_uri: z.string(),
  scopes_supported: z.array(z.string()),
  response_types_supported: z.array(z.string()),
  response_modes_supported: z.array(z.string()),
  grant_types_supported: z.array(z.string()),
  subject_types_supported: z.array(z.string()),
  id_token_signing_alg_values_supported: z.array(z.string()),
  request_object_signing_alg_values_supported: z.array(z.string()),
  token_endpoint_auth_methods_supported: z.array(z.string()),
  token_endpoint_auth_signing_alg_values_supported: z.array(z.string()),
  revocation_endpoint_auth_methods_supported: z.array(z.string()),
  revocation_endpoint_auth_signing_alg_values_supported: z.array(z.string()),
  introspection_endpoint_auth_methods_supported: z.array(z.string()),
  introspection_endpoint_auth_signing_alg_values_supported: z.array(z.string()),
  claims_supported: z.array(z.string()),
  code_challenge_methods_supported: z.array(z.string()),
  ui_locales_supported: z.array(z.string()),
  request_parameter_supported: z.boolean(),
  request_uri_parameter_supported: z.boolean(),
})

export const ZitadelClientOptionsSchema = z.object({
  issuerUrl: z.string(),
  privateJwtKeyPath: z.string(),
})

export type ZitadelWellKnown = z.infer<typeof ZitadelWellKnownSchema>
export type ZitadelClientOptions = z.infer<typeof ZitadelClientOptionsSchema>
