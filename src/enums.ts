export enum ApiEndpointsV1 {
  APPS_API = 'management/v1/projects/:projectId/apps/api', // https://zitadel.com/docs/apis/resources/mgmt/management-service-add-api-app
  APPS_API_CLIENT_SECRETS = 'management/v1/projects/:projectId/apps/:appId/api_config/_generate_client_secret', // https://zitadel.com/docs/apis/resources/mgmt/management-service-regenerate-api-client-secret
  APPS_OIDC = 'management/v1/projects/:projectId/apps/oidc', // https://zitadel.com/docs/apis/resources/mgmt/management-service-add-oidc-app
  LOGIN_SETTINGS = 'admin/v1/policies/login', // https://zitadel.com/docs/apis/resources/admin/admin-service-update-login-policy
  MACHINE_USERS_PATS = 'management/v1/users/:userId/pats', // https://zitadel.com/docs/apis/resources/mgmt/management-service-add-personal-access-token
  MACHINE_USERS = 'management/v1/users/machine', // https://zitadel.com/docs/apis/resources/mgmt/management-service-add-machine-user
  PROJECTS = 'management/v1/projects', // https://zitadel.com/docs/apis/resources/mgmt/management-service-add-project
  USERS = 'management/v1/users', // https://zitadel.com/docs/apis/resources/mgmt/management-service-get-user-by-id
  USERS_SEARCH = 'management/v1/users/_search', // https://zitadel.com/docs/apis/resources/mgmt/management-service-list-users
  GLOBAL_USERS = 'management/v1/global/users/_by_login_name', // https://zitadel.com/docs/apis/resources/mgmt/management-service-get-user-by-login-name-global
  METADATA = 'management/v1/users/:id/metadata/:key', // https://zitadel.com/docs/apis/resources/mgmt/management-service-get-user-metadata
}

export enum UsersEndpointsV1 {
  USER_HISTORY = 'management/v1/users/:userId/changes/_search', // https://zitadel.com/docs/apis/resources/mgmt/management-service-list-user-changes
  IS_UNIQUE = 'management/v1/users/_is_unique', // https://zitadel.com/docs/apis/resources/mgmt/management-service-is-user-unique
  USER_AVATAR = 'management/v1/users/:userId/avatar', // https://zitadel.com/docs/apis/resources/mgmt/management-service-remove-human-avatar
  MACHINE_USER = 'management/v1/users/:userId/machine', // https://zitadel.com/docs/apis/resources/mgmt/management-service-update-machine
  USER_SECRET = 'management/v1/users/:userId/secret', // https://zitadel.com/docs/apis/resources/mgmt/management-service-remove-machine-secret
}

export enum ApiEndpointsV2 {
  HUMAN_USERS = 'v2/users/human', // https://zitadel.com/docs/apis/resources/user_service_v2/user-service-add-human-user
  ORGANIZATIONS = 'v2/organizations', // https://zitadel.com/docs/apis/resources/org_service_v2/organization-service-add-organization
  USERS = 'v2/users/:userId', // https://zitadel.com/docs/apis/resources/user_service_v2/user-service-get-user-by-id
}

export enum ZitadelUserType {
  UNSPECIFIED = 'TYPE_UNSPECIFIED',
  HUMAN = 'TYPE_HUMAN',
  MACHINE = 'TYPE_MACHINE',
}

export enum ZitadelUserStateType {
  UNSPECIFIED = 'USER_STATE_UNSPECIFIED',
  ACTIVE = 'USER_STATE_ACTIVE',
  INACTIVE = 'USER_STATE_INACTIVE',
  DELETED = 'USER_STATE_DELETED',
  LOCKED = 'USER_STATE_LOCKED',
  SUSPEND = 'USER_STATE_SUSPEND',
  INITIAL = 'USER_STATE_INITIAL',
}

export enum ZitadelUsersSearchSortingColumn {
  UNSPECIFIED = 'USER_FIELD_NAME_UNSPECIFIED',
  USER_NAME = 'USER_FIELD_NAME_USER_NAME',
  FIRST_NAME = 'USER_FIELD_NAME_FIRST_NAME',
  LAST_NAME = 'USER_FIELD_NAME_LAST_NAME',
  NICK_NAME = 'USER_FIELD_NAME_NICK_NAME',
  DISPLAY_NAME = 'USER_FIELD_NAME_DISPLAY_NAME',
  EMAIL = 'USER_FIELD_NAME_EMAIL',
  STATE = 'USER_FIELD_NAME_STATE',
  TYPE = 'USER_FIELD_NAME_TYPE',
  CREATION_DATE = 'USER_FIELD_NAME_CREATION_DATE',
}

export enum ZitadelTextQueryMethod {
  EQUALS = 'TEXT_QUERY_METHOD_EQUALS',
  EQUALS_IGNORE_CASE = 'TEXT_QUERY_METHOD_EQUALS_IGNORE_CASE',
  STARTS_WITH = 'TEXT_QUERY_METHOD_STARTS_WITH',
  STARTS_WITH_IGNORE_CASE = 'TEXT_QUERY_METHOD_STARTS_WITH_IGNORE_CASE',
  CONTAINS = 'TEXT_QUERY_METHOD_CONTAINS',
  CONTAINS_IGNORE_CASE = 'TEXT_QUERY_METHOD_CONTAINS_IGNORE_CASE',
  ENDS_WITH = 'TEXT_QUERY_METHOD_ENDS_WITH',
  ENDS_WITH_IGNORE_CASE = 'TEXT_QUERY_METHOD_ENDS_WITH_IGNORE_CASE',
}
