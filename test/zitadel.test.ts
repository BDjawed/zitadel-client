/* eslint no-console: "off" */
import fs from 'node:fs'
import path from 'node:path'
import { ZitadelClient } from '@creoox-public/zitadel-client'
import * as ZITADEL from '@creoox-public/zitadel-client'
import * as dotenv from 'dotenv'
import { beforeAll, describe, expect, expectTypeOf, it } from 'vitest'
import { ZitadelAppApiAuthMethodType } from '../src/dtos/api/app-api-create.dto'
import { ZitadelTextQueryMethod, ZitadelUsersSearchSortingColumn } from '../src/enums'
import { ZitadelMachineUserKeyType } from '../src/responses/machine-user-key-by-id-get.response'

console.log('🚀 Starting Zitadel tests...')

let areEnvVarsValid = false

dotenv.config()

const ZITADEL_INSTANCE_URL = process.env.ZITADEL_INSTANCE_URL
const ZITADEL_KEY_FILE_PATH = process.env.ZITADEL_KEY_FILE_PATH
const ZITADEL_HUMAN_USER_PASSWORD = process.env.ZITADEL_HUMAN_USER_PASSWORD
const ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE = process.env.ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE
const ZITADEL_APP_OIDC_REDIRECT_URI = process.env.ZITADEL_APP_OIDC_REDIRECT_URI
const ZITADEL_PROVISIONING_RESPONSE_FILE_PATH = process.env.ZITADEL_PROVISIONING_RESPONSE_FILE_PATH
const ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH = process.env.ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH

describe('environment Variable Tests', () => {
  beforeAll(() => {
    // Check for required environment variables
    if (!ZITADEL_INSTANCE_URL) {
      throw new Error('ZITADEL_INSTANCE_URL is not defined')
    }
    if (!ZITADEL_KEY_FILE_PATH) {
      throw new Error('ZITADEL_KEY_FILE_PATH is not defined')
    }
    if (!ZITADEL_PROVISIONING_RESPONSE_FILE_PATH) {
      throw new Error('ZITADEL_PROVISIONING_RESPONSE_FILE_PATH is not defined')
    }
    if (!ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH) {
      throw new Error('ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH is not defined')
    }
    if (!ZITADEL_HUMAN_USER_PASSWORD) {
      throw new Error('ZITADEL_HUMAN_USER_PASSWORD is not defined')
    }
    if (!ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE) {
      throw new Error('ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE is not defined')
    }
    if (!ZITADEL_APP_OIDC_REDIRECT_URI) {
      throw new Error('ZITADEL_APP_OIDC_REDIRECT_URI is not defined')
    }

    areEnvVarsValid = true

    console.log('✓ Environment variables loaded')
  })

  it('should have all required environment variables defined', () => {
    expect(ZITADEL_INSTANCE_URL).toBeDefined()
    expect(ZITADEL_KEY_FILE_PATH).toBeDefined()
    expect(ZITADEL_PROVISIONING_RESPONSE_FILE_PATH).toBeDefined()
    expect(ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH).toBeDefined()
    expect(ZITADEL_HUMAN_USER_PASSWORD).toBeDefined()
    expect(ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE).toBeDefined()
    expect(ZITADEL_APP_OIDC_REDIRECT_URI).toBeDefined()
  })
})

describe('zitadel methods test', () => {
  let zitadelClient: ZITADEL.ZitadelClient
  // let provisioningFile: ZITADEL.ZitadelProvisioningResponse
  let authenticationStatus: ZITADEL.ZitadelAuthenticationResponse
  let defaultLoginSettings: ZITADEL.ZitadelLoginSettingsGetResponse
  let testOrganization: ZITADEL.ZitadelOrganizationCreateResponse
  let testHumanUser: ZITADEL.ZitadelHumanUserCreateResponse
  let testMachineUser: ZITADEL.ZitadelMachineUserCreateResponse
  let testProject: ZITADEL.ZitadelProjectCreateResponse
  // let testOidcApp: ZITADEL.ZitadelAppOidcCreateResponse
  let testMachineUserPat: ZITADEL.ZitadelMachineUserPatCreateResponse
  let testMachineUserKey: ZITADEL.ZitadelMachineUserKeyCreateResponse
  let testAppApi: ZITADEL.ZitadelAppApiCreateResponse

  const testHumanUserData = {
    username: 'TestHumanUser',
    organization: {
      orgId: '',
    },
    profile: {
      givenName: 'Test',
      familyName: 'User',
      nickName: 'Testy',
      displayName: 'Testy User',
      preferredLanguage: 'en',
      gender: ZITADEL.ZitadelUserGender.UNSPECIFIED,
    },
    email: {
      email: 'testy.user@example.com',
      isVerified: true,
    },
    password: {
      password: ZITADEL_HUMAN_USER_PASSWORD as string,
      changeRequired: false,
    },
  }

  beforeAll(async () => {
    try {
      // Check for required environment variables
      if (!areEnvVarsValid) {
        console.warn('Skipping Test due to invalid environment variables.')
        return
      }

      // Load the provisioning file
      /* try {
        provisioningFile = JSON.parse(
          fs.readFileSync(ZITADEL_PROVISIONING_RESPONSE_FILE_PATH as string, 'utf8'),
        )
        console.log('✓ Provisioning file loaded successfully')
      }
      catch (error) {
        throw new Error(`Failed to parse provisioning file: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Check the structure of the provisioning file
      expect(Array.isArray(provisioningFile.machineUsers)).toBe(true)
      expect(provisioningFile.machineUsers.length).toBeGreaterThan(0)
      expect(provisioningFile.creDashboardProject).toBeDefined()
      expect(provisioningFile.creLandOrganization?.organizationId).toBeDefined()
      expect(provisioningFile.creLandHumanUser?.userId).toBeDefined()
      console.log('✓ Provisioning file structure verified')
      */

      // Initialize the Zitadel client
      zitadelClient = new ZitadelClient({
        issuerUrl: ZITADEL_INSTANCE_URL as string,
        privateJwtKeyPath: ZITADEL_KEY_FILE_PATH as string,
      })

      await zitadelClient.setup()
      console.log('✓ Zitadel client initialized successfully')
    }
    catch (error) {
      console.error('❌ Setup failed:', error)
      throw error
    }
  })

  // Check if the client is authenticated
  it('should be authenticated', async () => {
    try {
      authenticationStatus = zitadelClient.getAuthenticationResponse()
      expectTypeOf(authenticationStatus).toEqualTypeOf<ZITADEL.ZitadelAuthenticationResponse>()
      console.log('✓ Zitadel client authenticated')
      // export ZitadelAuthenticationResponse into a file
      const fileName = path.join(ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH as string, 'authentication.json')
      fs.writeFileSync(
        fileName,
        JSON.stringify(authenticationStatus, null, 2),
        'utf8',
      )
    }
    catch (error) {
      console.error('❌ Authentication failed:', error)
      throw error
    }
  })

  it('should get user info', async () => {
    try {
      const userInfos = await zitadelClient.getUserInfo()
      expectTypeOf(userInfos).toEqualTypeOf<ZITADEL.ZitadelUserInfoGetResponse>()
      console.log('✓ User info retrieved, USER_ID:', userInfos.sub)
    }
    catch (error) {
      console.error('❌ Get user info failed:', error)
      throw error
    }
  })

  it('should get default login settings', async () => {
    try {
      const loginSettings = await zitadelClient.getLoginSettings()
      expectTypeOf(loginSettings).toEqualTypeOf<ZITADEL.ZitadelLoginSettingsGetResponse>()
      console.log('✓ Default login settings fetched successfully')
      defaultLoginSettings = loginSettings
    }
    catch (error) {
      console.error('❌ Default login settings fetch failed:', error)
      throw error
    }
  })

  it('should update login settings', async () => {
    const loginSettings = {
      passwordlessType: ZITADEL.ZitadelPasswordlessType.NOT_ALLOWED,
      forceMfa: false,
      forceMfaLocalOnly: false,
      passwordCheckLifetime: '864000s',
      externalLoginCheckLifetime: '864000s',
      mfaInitSkipLifetime: '2592000s',
      secondFactorCheckLifetime: '64800s',
      multiFactorCheckLifetime: '43200s',
      allowUsernamePassword: !defaultLoginSettings.policy.allowUsernamePassword,
      allowRegister: false,
      allowExternalIdp: true,
      hidePasswordReset: true,
      allowDomainDiscovery: true,
      ignoreUnknownUsernames: true,
      disableLoginWithEmail: true,
      disableLoginWithPhone: true,
      defaultRedirectUri: '',
    }
    try {
      await zitadelClient.updateLoginSettings(loginSettings)
      console.log('✓ Login settings updated successfully')
    }
    catch (error) {
      console.error('❌ Login settings update failed:', error)
      throw error
    }
  })

  it('should create an organization', async () => {
    try {
      const organization = await zitadelClient.createOrganization({
        name: 'TestOrganization',
      })
      expectTypeOf(organization).toEqualTypeOf<ZITADEL.ZitadelOrganizationCreateResponse>()
      console.log('✓ Organization created successfully')
      testOrganization = organization
      testHumanUserData.organization.orgId = organization.organizationId
    }
    catch (error) {
      console.error('❌ Organization creation failed:', error)
      throw error
    }
  })

  it('should create a human user', async () => {
    try {
      const humanUser = await zitadelClient.createHumanUser(testHumanUserData)

      expectTypeOf(humanUser).toEqualTypeOf<ZITADEL.ZitadelHumanUserCreateResponse>()
      console.log('✓ Human user created successfully with ID:', humanUser.userId)

      testHumanUser = humanUser
    }
    catch (error) {
      console.error('❌ Human user creation failed:', error)
      throw error
    }
  })

  it('should get user by ID', async () => {
    try {
      const user = await zitadelClient.getUserById(
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(user).toEqualTypeOf<ZITADEL.ZitadelUserByIdGetResponse>()
      console.log('✓ User retrieved successfully with ID:', user.user.userId)
    }
    catch (error) {
      console.error('❌ User retrieval failed:', error)
      throw error
    }
  })

  it('should get user by login name', async () => {
    try {
      const user = await zitadelClient.getUserByLoginName(
        {
          loginName: testHumanUserData.username,
        },
      )
      expectTypeOf(user).toEqualTypeOf<ZITADEL.ZitadelUserByLoginNameGetResponse>()
      console.log('✓ User retrieved successfully with login name, ID:', user.user.id)
    }
    catch (error) {
      console.error('❌ User retrieval failed:', error)
      throw error
    }
  })

  it('should search users by query', async () => {
    try {
      const users = await zitadelClient.usersSearch(
        {
          query: {
            offset: '0',
            limit: 100,
            asc: true,
          },
          sortingColumn: ZitadelUsersSearchSortingColumn.UNSPECIFIED,
          queries: [
            {
              displayNameQuery: {
                displayName: 't',
                method: ZitadelTextQueryMethod.CONTAINS,
              },
            },
          ],
        },
      )
      expectTypeOf(users).toEqualTypeOf<ZITADEL.ZitadelUsersSearchPostResponse>()
      console.log(`✓ Users retrieved successfully with query, found: ${users.details.totalResult} user(s), IDs: ${users.result.map(user => user.userId).join(', ')}`)
    }
    catch (error) {
      console.error('❌ Users retrieval failed:', error)
      throw error
    }
  })

  it('should get user history', async () => {
    try {
      const userHistory = await zitadelClient.getUserHistory(
        {
          query: {
            sequence: '0',
            limit: 100,
            asc: true,
          },
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(userHistory).toEqualTypeOf<ZITADEL.ZitadelUserHistoryPostResponse>()
      let events = ''
      for (const event of userHistory.result) {
        events = events.concat(`\t- event type: ${JSON.stringify(event.eventType)}\n`)
      }
      console.log(`✓ User history retrieved successfully, events: \n${events}`)
    }
    catch (error) {
      console.error('❌ User history retrieval failed:', error)
      throw error
    }
  })

  it('should deactivate a user', async () => {
    try {
      const deactivatedUser = await zitadelClient.userDeactivate(
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(deactivatedUser).toEqualTypeOf<ZITADEL.ZitadelUserDeactivatePostResponse>()
      console.log('✓ User deactivated successfully with ID:', testHumanUser.userId)
    }
    catch (error) {
      console.error('❌ User deactivation failed:', error)
      throw error
    }
  })

  it('should reactivate a user', async () => {
    try {
      const reactivatedUser = await zitadelClient.userReactivate(
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(reactivatedUser).toEqualTypeOf<ZITADEL.ZitadelUserReactivatePostResponse>()
      console.log('✓ User reactivated successfully with ID:', testHumanUser.userId)
    }
    catch (error) {
      console.error('❌ User reactivation failed:', error)
      throw error
    }
  })

  it('should lock a user', async () => {
    try {
      const lockedUser = await zitadelClient.userLock(
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(lockedUser).toEqualTypeOf<ZITADEL.ZitadelUserLockPostResponse>()
      console.log('✓ User locked successfully, USER_ID:', testHumanUser.userId)
    }
    catch (error) {
      console.error('❌ User locking failed:', error)
      throw error
    }
  })

  it('should unlock a user', async () => {
    try {
      const unlockedUser = await zitadelClient.userUnlock(
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(unlockedUser).toEqualTypeOf<ZITADEL.ZitadelUserUnlockPostResponse>()
      console.log('✓ User unlocked successfully, USER_ID:', testHumanUser.userId)
    }
    catch (error) {
      console.error('❌ User unlocking failed:', error)
      throw error
    }
  })

  it('should create a project', async () => {
    try {
      const project = await zitadelClient.createProject({
        name: 'TestProject',
        projectRoleAssertion: true,
        projectRoleCheck: true,
        hasProjectCheck: true,
        privateLabelingSetting: ZITADEL.ZitadelProjectPrivateLabelingSetting.ENFORCE_PROJECT_RESOURCE_OWNER_POLICY,
      }, {
        'x-zitadel-orgid': testOrganization.organizationId,
      })

      expectTypeOf(project).toEqualTypeOf<ZITADEL.ZitadelProjectCreateResponse>()
      console.log('✓ Project created successfully with ID:', project.id)
      testProject = project
    }
    catch (error) {
      console.error('❌ Project creation failed:', error)
      throw error
    }
  })

  it('should create app api', async () => {
    try {
      const appApi = await zitadelClient.createAppApi(
        {
          name: 'TestAppApi',
          authMethodType: ZitadelAppApiAuthMethodType.BASIC,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
        {
          projectId: testProject.id,
        },
      )
      expectTypeOf(appApi).toEqualTypeOf<ZITADEL.ZitadelAppApiCreateResponse>()
      console.log('✓ App API created successfully')
      testAppApi = appApi
    }
    catch (error) {
      console.error('❌ App API creation failed:', error)
      throw error
    }
  })

  it('should create app api client secret', async () => {
    try {
      const appApiClientSecret = await zitadelClient.createAppApiClientSecret(
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
        {
          projectId: testProject.id,
          appId: testAppApi.appId,
        },
      )
      expectTypeOf(appApiClientSecret).toEqualTypeOf<ZITADEL.ZitadelAppClientSecretCreateResponse>()
      console.log('✓ App API client secret created successfully, CLIENT_SECRET:', appApiClientSecret.clientSecret)
    }
    catch (error) {
      console.error('❌ App API client secret creation failed:', error)
      throw error
    }
  })

  it('should delete app api', async () => {
    try {
      const response = await zitadelClient.deleteAppApi(
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
        {
          projectId: testProject.id,
          appId: testAppApi.appId,
        },
      )
      expectTypeOf(response).toEqualTypeOf<ZITADEL.ZitadelAppApiDeleteResponse>()
      console.log('✓ App API deleted successfully')
    }
    catch (error) {
      console.error('❌ App API deletion failed:', error)
      throw error
    }
  })

  it('should create an OIDC application', async () => {
    try {
      const oidcApp = await zitadelClient.createAppOidc(
        {
          name: 'TestOIDCApp',
          redirectUris: [ZITADEL_APP_OIDC_REDIRECT_URI as string],
          responseTypes: [ZITADEL.ZitadelAppOidcResponseType.CODE],
          grantTypes: [ZITADEL.ZitadelAppOidcGrantType.AUTHORIZATION_CODE],
          appType: ZITADEL.ZitadelAppOidcAppType.WEB,
          authMethodType: ZITADEL.ZitadelAppOidcAuthMethodType.POST,
          postLogoutRedirectUris: [],
          version: ZITADEL.ZitadelAppOidcVersionType['1_0'],
          devMode: true,
          accessTokenType: ZITADEL.ZitadelAppOidcAccessTokenType.JWT,
          accessTokenRoleAssertion: false,
          idTokenRoleAssertion: false,
          idTokenUserinfoAssertion: false,
          clockSkew: '1s',
          additionalOrigins: [],
          skipNativeAppSuccessPage: true,
          backChannelLogoutUri: [],
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
        {
          projectId: testProject.id,
        },
      )
      expectTypeOf(oidcApp).toEqualTypeOf<ZITADEL.ZitadelAppOidcCreateResponse>()
      console.log('✓ OIDC application created successfully with ID:', oidcApp.appId)
      testOidcApp = oidcApp
    }
    catch (error) {
      console.error('❌ OIDC application creation failed:', error)
      throw error
    }
  })

  it('should create a machine user', async () => {
    try {
      const machineUser = await zitadelClient.createMachineUser(
        {
          userName: 'TestMachineUser',
          name: 'Test Machine User',
          description: 'Test machine user description',
          accessTokenType: ZITADEL.ZitadelMachineUserAccessTokenType.JWT,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(machineUser).toEqualTypeOf<ZITADEL.ZitadelMachineUserCreateResponse>()
      console.log('✓ Machine user created successfully with ID:', machineUser.userId)
      testMachineUser = machineUser
    }
    catch (error) {
      console.error('❌ Machine user creation failed:', error)
      throw error
    }
  })

  it('should create a machine user PAT', async () => {
    try {
      const machineUserPat = await zitadelClient.createMachineUserPAT(
        {
          expirationDate: new Date(ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE as string),
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
        {
          userId: testMachineUser.userId,
        },
      )
      expectTypeOf(machineUserPat).toEqualTypeOf<ZITADEL.ZitadelMachineUserPatCreateResponse>()
      console.log('✓ Machine user PAT created successfully, with TOKEN_ID:', machineUserPat.tokenId)
      testMachineUserPat = machineUserPat
    }
    catch (error) {
      console.error('❌ Machine user PAT creation failed:', error)
      throw error
    }
  })

  it('should create machine user key', async () => {
    try {
      const type = ZitadelMachineUserKeyType.JSON
      const machineUserKey = await zitadelClient.createMachineUserKey(
        {
          type,
          expirationDate: new Date(ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE as string),
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
        {
          userId: testMachineUser.userId,
        },
      )
      expectTypeOf(machineUserKey).toEqualTypeOf<ZITADEL.ZitadelMachineUserKeyCreateResponse>()
      console.log('✓ Machine user key created successfully, with KEY_ID:', machineUserKey.keyId)
      testMachineUserKey = machineUserKey
    }
    catch (error) {
      console.error('❌ Machine user key creation failed:', error)
      throw error
    }
  })

  it('should get machine user key by ID', async () => {
    try {
      const machineUserKey = await zitadelClient.getMachineUserKeyById(
        {
          userId: testMachineUser.userId,
          keyId: testMachineUserKey.keyId,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(machineUserKey).toEqualTypeOf<ZITADEL.ZitadelMachineUserKeyByIdGetResponse>()
      console.log('✓ Machine user key retrieved successfully, with KEY_ID:', machineUserKey.key.id)
    }
    catch (error) {
      console.error('❌ Machine user retrieval failed:', error)
      throw error
    }
  })

  it('should get machine user keys list', async () => {
    try {
      const machineUserKeys = await zitadelClient.getMachineUserKeys(
        {
          userId: testMachineUser.userId,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
        {
          query: {
            offset: '0',
            limit: 100,
            asc: true,
          },
        },
      )
      expectTypeOf(machineUserKeys).toEqualTypeOf<ZITADEL.ZitadelMachineUserKeysGetResponse>()
      console.log(`✓ Machine user keys list retrieved successfully, found: ${machineUserKeys.result.length} key(s)`)
    }
    catch (error) {
      console.error('❌ Machine user keys retrieval failed:', error)
      throw error
    }
  })

  it('should get machine user PAT', async () => {
    try {
      const machineUserPat = await zitadelClient.getMachineUserPAT(
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
        {
          tokenId: testMachineUserPat.tokenId,
          userId: testMachineUser.userId,
        },
      )
      expectTypeOf(machineUserPat).toEqualTypeOf<ZITADEL.ZitadelMachineUserPatGetResponse>()
      console.log(`✓ PAT fetched successfully for machine user with ID: ${testMachineUser.userId} and TOKEN_ID:`, machineUserPat.token.id)
    }
    catch (error) {
      console.error('❌ Machine user PAT fetch failed:', error)
      throw error
    }
  })

  it('should get machine user PATs list', async () => {
    try {
      const machineUserPats = await zitadelClient.getMachineUserPATsList(
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
        {
          userId: testMachineUser.userId,
        },
        {
          offset: '0',
          limit: 100,
          asc: true,
        },
      )
      expectTypeOf(machineUserPats).toEqualTypeOf<ZITADEL.ZitadelMachineUserPatsListGetResponse>()
      console.log(`✓ PATs list fetched successfully for machine user with ID: ${testMachineUser.userId}, found: ${machineUserPats.result.length} PAT(s)`)
    }
    catch (error) {
      console.error('❌ Machine user PATs list fetch failed:', error)
      throw error
    }
  })

  it('should delete machine user PAT', async () => {
    try {
      const machineUserPat = await zitadelClient.deleteMachineUserPAT(
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
        {
          tokenId: testMachineUserPat.tokenId,
          userId: testMachineUser.userId,
        },
      )
      expectTypeOf(machineUserPat).toEqualTypeOf<ZITADEL.ZitadelMachineUserPatDeleteResponse>()
      console.log(`✓ PAT deleted successfully for machine user with ID: ${testMachineUser.userId}`)
    }
    catch (error) {
      console.error('❌ Machine user PAT delete failed:', error)
      throw error
    }
  })

  it('should get user IDPs list', async () => {
    try {
      const userIdps = await zitadelClient.getUserIDPsList(
        {
          query: {
            offset: '0',
            limit: 100,
            asc: true,
          },
        },
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(userIdps).toEqualTypeOf<ZITADEL.ZitadelMachineUserIdpsListGetResponse>()
      console.log(`✓ User IDPs list fetched successfully for user with ID: ${testHumanUser.userId}, found: ${userIdps?.result?.length ?? 0} IDP(s)`)
    }
    catch (error) {
      console.error('❌ User IDPs list fetch failed:', error)
      throw error
    }
  })

  it('should delete a user', async () => {
    try {
      const user = await zitadelClient.deleteUserById(
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(user).toEqualTypeOf<ZITADEL.ZitadelUserDeleteResponse>()
      console.log('✓ User deleted successfully with ID:', testHumanUser.userId)
    }
    catch (error) {
      console.error('❌ User deletion failed:', error)
      throw error
    }
  })

  it('should delete an organization', async () => {
    try {
      const organization = await zitadelClient.deleteOrganization({
        'x-zitadel-orgid': testOrganization.organizationId,
      })
      expectTypeOf(organization).toEqualTypeOf<ZITADEL.ZitadelOrganizationDeleteResponse>()
      console.log('✓ Organization deleted successfully')
    }
    catch (error) {
      console.error('❌ Organization delete failed:', error)
      throw error
    }
  })
})

/*
describe('zitadel GetUser Test', () => {
  let zitadelClient: ZitadelClient
  let provisioningFile: ZitadelProvisioningResponse

  beforeAll(async () => {
    try {
      if (!areEnvVarsValid) {
        console.warn('Skipping Test due to invalid environment variables.')
        return
      }

      // Load the provisioning file
      try {
        console.log('✓ Provisioning file path', ZITADEL_PROVISIONING_RESPONSE_FILE_PATH)
        if (!ZITADEL_PROVISIONING_RESPONSE_FILE_PATH) {
          throw new Error('Provisioning path not defined')
        }
        if (!ZITADEL_INSTANCE_URL) {
          throw new Error('ZITADEL_INSTANCE_URL not defined')
        }
        if (!ZITADEL_KEY_FILE_PATH) {
          throw new Error('ZITADEL_KEY_FILE_PATH not defined')
        }
        provisioningFile = JSON.parse(
          fs.readFileSync(ZITADEL_PROVISIONING_RESPONSE_FILE_PATH, 'utf8'),
        )
        console.log('✓ Provisioning file loaded successfully')
      }
      catch (error) {
        throw new Error(`Failed to parse provisioning file: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Check the structure of the provisioning file
      expect(Array.isArray(provisioningFile.machineUsers)).toBe(true)
      expect(provisioningFile.machineUsers.length).toBeGreaterThan(0)
      expect(provisioningFile.creDashboardProject).toBeDefined()
      expect(provisioningFile.creLandOrganization?.organizationId).toBeDefined()
      expect(provisioningFile.creLandHumanUser?.userId).toBeDefined()
      console.log('✓ Provisioning file structure verified')
      console.log(`✓ Found ${provisioningFile.machineUsers.length} machine users`)

      // Initialize the Zitadel client
      zitadelClient = new ZitadelClient({
        issuerUrl: ZITADEL_INSTANCE_URL,
        privateJwtKeyPath: ZITADEL_KEY_FILE_PATH,
      })

      await zitadelClient.setup()
      console.log('✓ Zitadel client initialized successfully')
    }
    catch (error) {
      console.error('❌ Setup failed:', error)
      throw error
    }
  })

  afterAll(async () => {
    try {
      console.log('🧹 Cleaning up...')
      if (zitadelClient) {
        // Cleanup the Zitadel client
        // await zitadelClient.cleanup()
        console.log('✓ Cleanup completed')
      }
    }
    catch (error) {
      console.error('❌ Cleanup failed:', error)
    }
  })

  it('should fetch machine users information', async () => {
    try {
      console.log('⏱️ Testing machine users...')
      const creLandMachineUsers = []

      for (const machineUser of provisioningFile.machineUsers) {
        const { userId } = machineUser.machineUser
        console.log(`✓ Fetching info for machine user: ${machineUser.name}`)

        const userInfo = await zitadelClient.getUserById({ userId })
        expectTypeOf(userInfo).toEqualTypeOf<ZitadelUserByIdGetResponse>()
        creLandMachineUsers.push(userInfo.user)

        console.log(`✓ Testing login names for ${machineUser.name}`)
        for (const loginName of userInfo.user.loginNames) {
          const userByLoginName = await zitadelClient.getUserByLoginName({ loginName })
          expectTypeOf(userByLoginName).toEqualTypeOf<ZitadelUserByLoginNameGetResponse>()
          console.log(`✓ Login name ${loginName} found for ${machineUser.name}`)
        }
      }

      expect(creLandMachineUsers).toHaveLength(provisioningFile.machineUsers.length)
      console.log('✓ Machine users info fetched successfully: ', creLandMachineUsers)
      console.log('✅ Machine users test completed successfully')
    }
    catch (error) {
      console.error('❌ Machine users test failed:', error)
      throw error
    }
  })

  it('should fetch human user information', async () => {
    try {
      console.log('⌚ Testing human user...')

      const humanUserInfo = await zitadelClient.getUserById({
        userId: provisioningFile.creLandHumanUser.userId,
      })
      expectTypeOf(humanUserInfo).toEqualTypeOf<ZitadelUserByIdGetResponse>()
      console.log('✓ Human user info fetched successfully')

      console.log('⌚ Testing login names for human user')
      for (const loginName of humanUserInfo.user.loginNames) {
        const userByLoginName = await zitadelClient.getUserByLoginName({ loginName })
        expectTypeOf(userByLoginName).toEqualTypeOf<ZitadelUserByLoginNameGetResponse>()
      }
      console.log('✓ Login names for human user fetched successfully: ', humanUserInfo)
      console.log('✅ Human user test completed successfully')
    }
    catch (error) {
      console.error('❌ Human user test failed:', error)
      throw error
    }
  })

  it('should verify organization access', async () => {
    try {
      console.log('⌚ Testing organization access...')

      expect(provisioningFile.creLandOrganization.organizationId).toBeDefined()

      const orgId = provisioningFile.creLandOrganization.organizationId
      expect(typeof orgId).toBe('string')
      expect(orgId.length).toBeGreaterThan(0)

      console.log('✓ Organization ID:', orgId)
      console.log('✅ Organization verification completed successfully')
    }
    catch (error) {
      console.error('❌ Organization verification failed:', error)
      throw error
    }
  })
})
*/
