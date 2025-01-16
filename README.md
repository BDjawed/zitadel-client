# Zitadel Client @bdjawed/zitadel-client

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

This project provides a client to interact with the Zitadel API. It allows managing users, organizations, projects, and more.

## Table of Contents

- [Zitadel Client @bdjawed/zitadel-client](#zitadel-client-bdjawedzitadel-client)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Client Initialization](#client-initialization)
    - [Methods](#methods)
      - [`getUserInfo`](#getuserinfo)
      - [`createOrganization`](#createorganization)
      - [`deleteOrganization`](#deleteorganization)
      - [`createHumanUser`](#createhumanuser)
      - [`createMachineUser`](#createmachineuser)
      - [`createMachineUserKey`](#createmachineuserkey)
      - [`getMachineUserKeyById`](#getmachineuserkeybyid)
      - [`getMachineUserKeys`](#getmachineuserkeys)
      - [`userDeactivate`](#userdeactivate)
      - [`userReactivate`](#userreactivate)
      - [`userLock`](#userlock)
      - [`userUnlock`](#userunlock)
      - [`createMachineUserPAT`](#createmachineuserpat)
      - [`getMachineUserPAT`](#getmachineuserpat)
      - [`getMachineUserPATsList`](#getmachineuserpatslist)
      - [`deleteMachineUserPAT`](#deletemachineuserpat)
      - [`getUserIDPsList`](#getuseridpslist)
      - [`deleteMachineUserKey`](#deletemachineuserkey)
      - [`createProject`](#createproject)
      - [`createAppApi`](#createappapi)
      - [`deleteAppApi`](#deleteappapi)
      - [`createAppApiClientSecret`](#createappapiclientsecret)
      - [`createAppOidc`](#createappoidc)
      - [`updateLoginSettings`](#updateloginsettings)
      - [`getLoginSettings`](#getloginsettings)
      - [`getUserById`](#getuserbyid)
      - [`deleteUserById`](#deleteuserbyid)
      - [`getUserByLoginName`](#getuserbyloginname)
      - [`usersSearch`](#userssearch)
      - [`getUserHistory`](#getuserhistory)
      - [`isUserUnique`](#isuserunique)
      - [`getMetadataByKey`](#getmetadatabykey)
      - [`deleteMetadataByKey`](#deletemetadatabykey)
      - [`createMetadataByKey`](#createmetadatabykey)
      - [`deleteBulkMetadataByKey`](#deletebulkmetadatabykey)
      - [`createBulkMetadataByKey`](#createbulkmetadatabykey)
      - [`userMetadataSearch`](#usermetadatasearch)
      - [`deleteUserAvatar`](#deleteuseravatar)
      - [`updateMachineUser`](#updatemachineuser)
      - [`updateHumanUser`](#updatehumanuser)
      - [`deleteMachineUserSecret`](#deletemachineusersecret)
      - [`createMachineUserSecret`](#createmachineusersecret)
      - [`createUserEmail`](#createuseremail)
      - [`deleteUserPhone`](#deleteuserphone)
      - [`createUserPhone`](#createuserphone)
      - [`createUserPassword`](#createuserpassword)
      - [`createUserPasswordResetCode`](#createuserpasswordresetcode)
      - [`resendUserEmailVerificationCode`](#resenduseremailverificationcode)
      - [`resendUserPhoneVerificationCode`](#resenduserphoneverificationcode)
      - [`getUserAuthMethods`](#getuserauthmethods)
      - [`deleteUserTotp`](#deleteusertotp)
      - [`deleteUserU2fToken`](#deleteuseru2ftoken)
      - [`deleteUserOtpSms`](#deleteuserotpsms)
      - [`deleteUserOtpEmail`](#deleteuserotpemail)
      - [`getUserPasskeys`](#getuserpasskeys)
      - [`registerUserPasskey`](#registeruserpasskey)
      - [`registerUserPasskeyLink`](#registeruserpasskeylink)
      - [`deleteRegisteredUserPasskey`](#deleteregistereduserpasskey)
      - [`getUserPermissions`](#getuserpermissions)
  - [License](#license)

## Installation

```bash
npm install @bdjawed/zitadel-client
```

## Usage

### Client Initialization

```typescript
import { ZitadelClient } from '@bdjawed/zitadel-client'

const zitadelClient = new ZitadelClient({
  issuerUrl: 'https://your-zitadel-instance.com',
  privateJwtKeyPath: '/path/to/your/private-key.json',
})

await zitadelClient.setup()
```

### Methods

#### `getUserInfo`

Retrieves the authenticated user's information.

```typescript
const userInfo = await zitadelClient.getUserInfo()
console.log(userInfo)
```

#### `createOrganization`

Creates a new organization.

```typescript
const organization = await zitadelClient.createOrganization({
  name: 'TestOrganization',
})
console.log(organization)
```

#### `deleteOrganization`

Deletes an organization.

```typescript
await zitadelClient.deleteOrganization('organizationId')
console.log('Organization deleted')
```

#### `createHumanUser`

Creates a new human user.

```typescript
const humanUser = await zitadelClient.createHumanUser({
  username: 'minnie-mouse',
  profile: {
    givenName: 'Minnie',
    familyName: 'Mouse',
    nickName: 'Mini',
    displayName: 'Minnie Mouse',
    preferredLanguage: 'en',
  },
  email: {
    email: 'mini11@mouse.com',
  },
  password: {
    password: 'Secr3tP4ssw0rd!',
    changeRequired: false,
  },
})
console.log(humanUser)
```

#### `createMachineUser`

Creates a new machine user.

```typescript
const machineUser = await zitadelClient.createMachineUser({
  userName: 'TestMachineUser',
  name: 'Test Machine User',
  description: 'Test machine user description',
  accessTokenType: 'JWT',
}, 'organizationId')
console.log(machineUser)
```

#### `createMachineUserKey`

Creates a key for a machine user.

```typescript
const machineUserKey = await zitadelClient.createMachineUserKey('userId', {
  type: 'JSON',
  expirationDate: new Date('2023-12-31'),
}, 'organizationId')
console.log(machineUserKey)
```

#### `getMachineUserKeyById`

Retrieves a machine user key by ID.

```typescript
const machineUserKey = await zitadelClient.getMachineUserKeyById({
  userId: 'userId',
  keyId: 'keyId',
}, 'organizationId')
console.log(machineUserKey)
```

#### `getMachineUserKeys`

Retrieves the list of keys for a machine user.

```typescript
const machineUserKeys = await zitadelClient.getMachineUserKeys('userId', {
  query: {
    offset: '0',
    limit: 100,
    asc: true,
  },
}, 'organizationId')
console.log(machineUserKeys)
```

#### `userDeactivate`

Deactivates a user.

```typescript
await zitadelClient.userDeactivate('userId')
console.log('User deactivated')
```

#### `userReactivate`

Reactivates a user.

```typescript
await zitadelClient.userReactivate('userId')
console.log('User reactivated')
```

#### `userLock`

Locks a user.

```typescript
await zitadelClient.userLock('userId')
console.log('User locked')
```

#### `userUnlock`

Unlocks a user.

```typescript
await zitadelClient.userUnlock('userId')
console.log('User unlocked')
```

#### `createMachineUserPAT`

Creates a PAT for a machine user.

```typescript
const machineUserPat = await zitadelClient.createMachineUserPAT('userId', {
  expirationDate: new Date('2023-12-31'),
}, 'organizationId')
console.log(machineUserPat)
```

#### `getMachineUserPAT`

Retrieves a machine user PAT by ID.

```typescript
const machineUserPat = await zitadelClient.getMachineUserPAT({
  userId: 'userId',
  tokenId: 'tokenId',
}, 'organizationId')
console.log(machineUserPat)
```

#### `getMachineUserPATsList`

Retrieves the list of PATs for a machine user.

```typescript
const machineUserPats = await zitadelClient.getMachineUserPATsList('userId', {
  offset: '0',
  limit: 100,
  asc: true,
}, 'organizationId')
console.log(machineUserPats)
```

#### `deleteMachineUserPAT`

Deletes a machine user PAT.

```typescript
await zitadelClient.deleteMachineUserPAT({
  userId: 'userId',
  tokenId: 'tokenId',
}, 'organizationId')
console.log('PAT deleted')
```

#### `getUserIDPsList`

Retrieves the list of IDPs for a user.

```typescript
const userIdps = await zitadelClient.getUserIDPsList('userId', {
  query: {
    offset: '0',
    limit: 100,
    asc: true,
  },
})
console.log(userIdps)
```

#### `deleteMachineUserKey`

Deletes a machine user key by ID.

```typescript
await zitadelClient.deleteMachineUserKey({
  userId: 'userId',
  keyId: 'keyId',
}, 'organizationId')
console.log('Machine user key deleted')
```

#### `createProject`

Creates a new project.

```typescript
const project = await zitadelClient.createProject({
  name: 'TestProject',
  projectRoleAssertion: true,
  projectRoleCheck: true,
  hasProjectCheck: true,
  privateLabelingSetting: 'ENFORCE_PROJECT_RESOURCE_OWNER_POLICY',
}, 'organizationId')
console.log(project)
```

#### `createAppApi`

Creates a new API for a project.

```typescript
const appApi = await zitadelClient.createAppApi('projectId', {
  name: 'TestAppApi',
  authMethodType: 'BASIC',
}, 'organizationId')
console.log(appApi)
```

#### `deleteAppApi`

Deletes an API from a project.

```typescript
await zitadelClient.deleteAppApi({
  projectId: 'projectId',
  appId: 'appId',
}, 'organizationId')
console.log('App API deleted')
```

#### `createAppApiClientSecret`

Creates a client secret for an API.

```typescript
const appApiClientSecret = await zitadelClient.createAppApiClientSecret({
  projectId: 'projectId',
  appId: 'appId',
}, 'organizationId')
console.log(appApiClientSecret)
```

#### `createAppOidc`

Creates a new OIDC application for a project.

```typescript
const oidcApp = await zitadelClient.createAppOidc('projectId', {
  name: 'TestOIDCApp',
  redirectUris: ['https://example.com/callback'],
  responseTypes: 'OIDC_RESPONSE_TYPE_CODE',
  grantTypes: 'OIDC_GRANT_TYPE_AUTHORIZATION_CODE',
  appType: 'OIDC_APP_TYPE_WEB',
  authMethodType: 'OIDC_AUTH_METHOD_TYPE_POST',
  postLogoutRedirectUris: [],
  version: 'OIDC_VERSION_1_0',
  devMode: true,
  accessTokenType: 'OIDC_TOKEN_TYPE_JWT',
  accessTokenRoleAssertion: false,
  idTokenRoleAssertion: false,
  idTokenUserinfoAssertion: false,
  clockSkew: '1s',
  additionalOrigins: [],
  skipNativeAppSuccessPage: true,
  backChannelLogoutUri: [],
}, 'organizationId')
console.log(oidcApp)
```

#### `updateLoginSettings`

Updates the login settings for the organization.

```typescript
const loginSettings = await zitadelClient.updateLoginSettings({
  passwordlessType: 'NOT_ALLOWED',
  forceMfa: false,
  allowUsernamePassword: true,
  allowRegister: false,
  allowExternalIdp: true,
  hidePasswordReset: true,
  allowDomainDiscovery: true,
  ignoreUnknownUsernames: true,
  disableLoginWithEmail: true,
  disableLoginWithPhone: true,
})
console.log(loginSettings)
```

#### `getLoginSettings`

Retrieves the login settings for the organization.

```typescript
const loginSettings = await zitadelClient.getLoginSettings('organizationId')
console.log(loginSettings)
```

#### `getUserById`

Retrieves a user by ID.

```typescript
const user = await zitadelClient.getUserById('userId')
console.log(user)
```

#### `deleteUserById`

Deletes a user by ID.

```typescript
await zitadelClient.deleteUserById('userId')
console.log('User deleted')
```

#### `getUserByLoginName`

Retrieves a user by login name.

```typescript
const user = await zitadelClient.getUserByLoginName('loginName')
console.log(user)
```

#### `usersSearch`

Searches for users based on the given query.

```typescript
const users = await zitadelClient.usersSearch({
  query: {
    offset: '0',
    limit: 100,
    asc: true,
  },
  sortingColumn: 'UNSPECIFIED',
  queries: [
    {
      displayNameQuery: {
        displayName: 't',
        method: 'CONTAINS',
      },
    },
  ],
})
console.log(users)
```

#### `getUserHistory`

Retrieves the history of events for a given user.

```typescript
const userHistory = await zitadelClient.getUserHistory('userId', {
  query: {
    sequence: '0',
    limit: 100,
    asc: true,
  },
}, 'organizationId')
console.log(userHistory)
```

#### `isUserUnique`

Checks if a user is unique.

```typescript
const isUserNameUnique = await zitadelClient.isUserUnique({
  userName: 'minnie-mouse',
}, 'organizationId')
console.log(isUserNameUnique)
```

#### `getMetadataByKey`

Retrieves a metadata object from a user by a specific key.

```typescript
const userMetadata = await zitadelClient.getMetadataByKey({
  userId: 'userId',
  key: 'my-key',
}, 'organizationId')
console.log(userMetadata)
```

#### `deleteMetadataByKey`

Deletes a metadata object from a user by a specific key.

```typescript
await zitadelClient.deleteMetadataByKey({
  userId: 'userId',
  key: 'my-key',
}, 'organizationId')
console.log('Metadata deleted')
```

#### `createMetadataByKey`

Creates metadata for a user with a specific key.

```typescript
const userMetadata = await zitadelClient.createMetadataByKey({
  userId: 'userId',
  key: 'my-key',
}, {
  value: 'VGhpcyBpcyBteSB0ZXN0IHZhbHVl',
}, 'organizationId')
console.log(userMetadata)
```

#### `deleteBulkMetadataByKey`

Deletes multiple metadata for a user with the provided keys.

```typescript
await zitadelClient.deleteBulkMetadataByKey('userId', {
  keys: ['key1', 'key2'],
}, 'organizationId')
console.log('Bulk metadata deleted')
```

#### `createBulkMetadataByKey`

Creates multiple metadata objects for a user with the provided keys.

```typescript
const userMetadataBulk = await zitadelClient.createBulkMetadataByKey('userId', {
  metadata: [
    { key: 'key1', value: 'value1' },
    { key: 'key2', value: 'value2' },
  ],
}, 'organizationId')
console.log(userMetadataBulk)
```

#### `userMetadataSearch`

Searches for user metadata filtered by your query.

```typescript
const userMetadata = await zitadelClient.userMetadataSearch('userId', {
  query: {
    offset: '0',
    limit: 100,
    asc: true,
  },
  queries: [
    {
      keyQuery: {
        key: 'my-key',
        method: 'EQUALS_IGNORE_CASE',
      },
    },
  ],
}, 'organizationId')
console.log(userMetadata)
```

#### `deleteUserAvatar`

Deletes a user's avatar.

```typescript
await zitadelClient.deleteUserAvatar('userId', 'organizationId')
console.log('User avatar deleted')
```

#### `updateMachineUser`

Updates a machine user.

```typescript
const machineUser = await zitadelClient.updateMachineUser('userId', {
  name: 'Updated Machine User',
  description: 'Updated machine user description',
  accessTokenType: 'BEARER',
}, 'organizationId')
console.log(machineUser)
```

#### `updateHumanUser`

Updates a human user.

```typescript
const updatedUser = await zitadelClient.updateHumanUser('userId', {
  username: 'UpdatedTestHumanUser',
  profile: {
    givenName: 'UpdatedTest',
    familyName: 'User',
    nickName: 'UpdatedTesty',
    displayName: 'UpdatedTesty User',
    preferredLanguage: 'en',
  },
  email: {
    email: 'testy@updated.com',
  },
  password: {
    password: { password: 'Secr3tP4ssw0rd!' },
  },
})
console.log(updatedUser)
```

#### `deleteMachineUserSecret`

Deletes a machine user's secret.

```typescript
await zitadelClient.deleteMachineUserSecret('userId', 'organizationId')
console.log('Machine user secret deleted')
```

#### `createMachineUserSecret`

Creates a secret for a machine user.

```typescript
const machineUserSecret = await zitadelClient.createMachineUserSecret('userId', 'organizationId')
console.log(machineUserSecret)
```

#### `createUserEmail`

Creates a new email address for a user.

```typescript
const userEmail = await zitadelClient.createUserEmail('userId', {
  email: 'mini321@mouse.com',
})
console.log(userEmail)
```

#### `deleteUserPhone`

Deletes a phone number for a user.

```typescript
await zitadelClient.deleteUserPhone('userId')
console.log('User phone deleted')
```

#### `createUserPhone`

Creates a new phone number for a user.

```typescript
const userPhone = await zitadelClient.createUserPhone('userId', {
  phone: '+1 123 456 7890',
})
console.log(userPhone)
```

#### `createUserPassword`

Creates a password for a user.

```typescript
const userPassword = await zitadelClient.createUserPassword('userId', {
  newPassword: {
    password: 'Secr3tP4ssw0rd!',
    changeRequired: false,
  },
})
console.log(userPassword)
```

#### `createUserPasswordResetCode`

Creates a password reset code for a user.

```typescript
const passwordResetCode = await zitadelClient.createUserPasswordResetCode('userId', {
  returnCode: {},
})
console.log(passwordResetCode)
```

#### `resendUserEmailVerificationCode`

Resend the verification code for a user's email address.

```typescript
const resendVerificationCode = await zitadelClient.resendUserEmailVerificationCode('userId', {
  returnCode: {},
})
console.log(resendVerificationCode)
```

#### `resendUserPhoneVerificationCode`

Resend the verification code for a user's phone number.

```typescript
const resendVerificationCode = await zitadelClient.resendUserPhoneVerificationCode('userId', {
  returnCode: {},
})
console.log(resendVerificationCode)
```

#### `getUserAuthMethods`

Retrieves the authentication methods of a user.

```typescript
const authMethods = await zitadelClient.getUserAuthMethods('userId', {
  includeWithoutDomain: true,
  domain: 'localhost',
})
console.log(authMethods)
```

#### `deleteUserTotp`

Deletes the TOTP configuration for a user.

```typescript
await zitadelClient.deleteUserTotp('userId')
console.log('User TOTP deleted')
```

#### `deleteUserU2fToken`

Deletes a U2F token for a user.

```typescript
await zitadelClient.deleteUserU2fToken({
  userId: 'userId',
  u2fId: 'u2fId',
})
console.log('User U2F token deleted')
```

#### `deleteUserOtpSms`

Deletes the OTP SMS configuration for a user.

```typescript
await zitadelClient.deleteUserOtpSms('userId')
console.log('User OTP SMS deleted')
```

#### `deleteUserOtpEmail`

Deletes the OTP Email configuration for a user.

```typescript
await zitadelClient.deleteUserOtpEmail('userId')
console.log('User OTP Email deleted')
```

#### `getUserPasskeys`

Retrieves the list of WebAuthn passkeys for a user.

```typescript
const passkeys = await zitadelClient.getUserPasskeys('userId', {})
console.log(passkeys)
```

#### `registerUserPasskey`

Starts the registration of a WebAuthn passkey for a user.

```typescript
const passkey = await zitadelClient.registerUserPasskey('userId', {
  code: {
    id: 'codeId',
    code: 'code',
  },
  authenticator: 'UNSPECIFIED',
  domain: 'localhost',
})
console.log(passkey)
```

#### `registerUserPasskeyLink`

Creates a registration link for a WebAuthn passkey for a user.

```typescript
const passkeyLink = await zitadelClient.registerUserPasskeyLink('userId', {
  returnCode: {},
})
console.log(passkeyLink)
```

#### `deleteRegisteredUserPasskey`

Deletes a registered WebAuthn passkey for a user.

```typescript
await zitadelClient.deleteRegisteredUserPasskey({
  userId: 'userId',
  passkeyId: 'passkeyId',
})
console.log('User passkey deleted')
```

#### `getUserPermissions`

Retrieves the permissions of a user.

```typescript
const permissions = await zitadelClient.getUserPermissions('userId', {
  query: {
    offset: '0',
    limit: 100,
    asc: true,
  },
  queries: [
    {
      iamQuery: {
        iam: true,
      },
    },
  ],
}, 'organizationId')
console.log(permissions)
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@bdjawed/zitadel-client?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@bdjawed/zitadel-client
[npm-downloads-src]: https://img.shields.io/npm/dm/@bdjawed/zitadel-client?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@bdjawed/zitadel-client
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@bdjawed/zitadel-client?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@bdjawed/zitadel-client
[license-src]: https://img.shields.io/github/license/Bdjawed/zitadel-client.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/Bdjawed/zitadel-client/blob/main/LICENSE.md
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/@bdjawed/zitadel-client

<!-- End Badges -->
