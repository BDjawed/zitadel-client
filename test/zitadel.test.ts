/* eslint no-console: "off" */
import fs from 'node:fs'
import path from 'node:path'
import { ZitadelClient } from '@creoox-public/zitadel-client'
import * as ZITADEL from '@creoox-public/zitadel-client'
import * as dotenv from 'dotenv'
import { beforeAll, describe, expect, expectTypeOf, it } from 'vitest'
import { ZitadelAppApiAuthMethodType } from '../src/dtos/api/app-api-create.dto'
import { ZitadelMachineUserAccessTokenType } from '../src/dtos/api/machine-user-create.dto'
import { AuthenticatorType } from '../src/dtos/api/user-passkey-register-post.dto'
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
  let singleMetadata: { key: string, value: string }
  let multipleMetadata: { key: string, value: string }[]
  // let retrievedHumanUser: ZITADEL.ZitadelUserByIdGetResponse
  let passwordResetCode: string
  let userPassKey: { id: string, code: string }
  let managerId: string

  /* const testHumanUserData1 = {
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
      isVerified: false,
    },
    password: {
      password: ZITADEL_HUMAN_USER_PASSWORD as string,
      changeRequired: false,
    },
  } */
  const testHumanUserData = {
    userId: undefined,
    username: 'minnie-mouse',
    organization: {
      orgId: 'string',
      // "orgDomain": "string"
    },
    profile: {
      givenName: 'Minnie',
      familyName: 'Mouse',
      nickName: 'Mini',
      displayName: 'Minnie Mouse',
      preferredLanguage: 'en',
      // "gender": "GENDER_FEMALE"
    },
    email: {
      email: 'mini11@mouse.com',
      /* "sendCode": {
        "urlTemplate": "https://example.com/email/verify?userID={{.UserID}}&code={{.Code}}&orgID={{.OrgID}}"
      }, */
      returnCode: {},
      // "isVerified": true
    },
    /* "phone": {
      "phone": "+41791234567",
      "sendCode": {},
      "returnCode": {},
      "isVerified": true
    }, */
    metadata: [
      {
        key: 'my-key',
        value: 'VGhpcyBpcyBteSB0ZXN0IHZhbHVl',
      },
    ],
    password: {
      password: 'Secr3tP4ssw0rd!',
      changeRequired: false,
    },
    /* "hashedPassword": {
      "hash": "$2a$12$lJ08fqVr8bFJilRVnDT9QeULI7YW.nT3iwUv6dyg0aCrfm3UY8XR2",
      "changeRequired": true
    },
    "idpLinks": [
      {
        "idpId": "d654e6ba-70a3-48ef-a95d-37c8d8a7901a",
        "userId": "6516849804890468048461403518",
        "userName": "user@external.com"
      }
    ],
    "totpSecret": "TJOPWSDYILLHXFV4MLKNNJOWFG7VSDCK" */
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
      managerId = userInfos.sub
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

  it('should show all the permissions the user has in ZITADEL (ZITADEL Manager)', async () => {
    try {
      const permissions = await zitadelClient.getUserPermissions(
        {
          userId: managerId,
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
          queries: [
            {
              /* orgQuery: {
                orgId: testOrganization.organizationId
              },
              projectQuery: {
                projectId: testOrganization.organizationId
              },
              projectGrantQuery: {
                projectGrantId: testOrganization.organizationId
              }, */
              iamQuery: {
                iam: true,
              },
            },
          ],

        },
      )
      expectTypeOf(permissions).toEqualTypeOf<ZITADEL.ZitadelUserPermissionsGetResponseDto>()
      console.log('✓ User permissions: ', permissions.result)
    }
    catch (error) {
      console.error('❌ Get user permissions failed:', error)
      throw error
    }
  })

  it('should check if a user is unique', async () => {
    try {
      const isUserNameUnique = await zitadelClient.isUserUnique(
        {
          userName: testHumanUserData.username,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      /* const isEmailUnique = await zitadelClient.isUserUnique(
        {
          email: testHumanUserData.email.email,
        },
        {
          "x-zitadel-orgid": testOrganization.organizationId,
        },
      ) */
      expectTypeOf(isUserNameUnique).toEqualTypeOf<ZITADEL.ZitadelUserExistingCheckGetResponse>()
      // expectTypeOf(isEmailUnique).toEqualTypeOf<ZITADEL.ZitadelUserExistingCheckGetResponse>()
      console.log(`✓ User name and email are unique, USER_NAME_UNIQUE: ${isUserNameUnique.isUnique}`)
    }
    catch (error) {
      console.error('❌ User uniqueness check failed:', error)
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

  it('should create human user email', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const humanUserEmail = await zitadelClient.createUserEmail(
        {
          userId: testHumanUser.userId,
        },
        {
          email: 'mini321@mouse.com',
          /* sendCode: {
            urlTemplate: 'https://example.com/email/verify?userID={{.UserID}}&code={{.Code}}&orgID={{.OrgID}}',
          }, */
          returnCode: {},
          // isVerified: true,
        },
      )
      expectTypeOf(humanUserEmail).toEqualTypeOf<ZITADEL.ZitadelUserEmailCreateResponse>()
      console.log('✓ Human user email created successfully, CODE:', humanUserEmail.verificationCode)
    }
    catch (error) {
      console.error('❌ Human user email creation failed:', error)
      throw error
    }
  })

  it('should create human user phone', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const humanUserPhone = await zitadelClient.createUserPhone(
        {
          userId: testHumanUser.userId,
        },
        {
          phone: '+1 123 456 7890',
          returnCode: {},
          // sendCode: {},
        },
      )
      expectTypeOf(humanUserPhone).toEqualTypeOf<ZITADEL.ZitadelUserPhoneCreateResponse>()
      console.log('✓ Human user phone created successfully, CODE:', humanUserPhone.verificationCode)
    }
    catch (error) {
      console.error('❌ Human user phone creation failed:', error)
      throw error
    }
  })

  it('should delete human user phone', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const humanUserPhone = await zitadelClient.deleteUserPhone(
        {
          userId: testHumanUser.userId,
        },
        {},
      )
      expectTypeOf(humanUserPhone).toEqualTypeOf<ZITADEL.ZitadelUserPhoneDeleteResponse>()
      console.log('✓ Human user phone deleted successfully')
    }
    catch (error) {
      console.error('❌ Human user phone deletion failed:', error)
      throw error
    }
  })

  it('should send human user change password verification code', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const returnCode = {}
      const verificationCode = await zitadelClient.createUserPasswordResetCode(
        {
          userId: testHumanUser.userId,
        },
        {
          /* sendLink: {
            notificationType: NotificationType.EMAIL,
            urlTemplate: 'https://example.com/password/reset?userID={{.UserID}}&code={{.Code}}&orgID={{.OrgID}}',
          }, */
          returnCode,
        },
      )
      expectTypeOf(verificationCode).toEqualTypeOf<ZITADEL.ZitadelUserPasswordResetCodeCreateResponse>()
      console.log('✓ Human user password reset code sent successfully, CODE:', verificationCode.verificationCode)
      if (returnCode && verificationCode.verificationCode)
        passwordResetCode = verificationCode.verificationCode
    }
    catch (error) {
      console.error('❌ Human user password reset code send failed:', error)
      throw error
    }
  })

  it('should create human user password by verification code', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const createPasswordByVerificationCode = await zitadelClient.createUserPassword(
        {
          userId: testHumanUser.userId,
        },
        {
          newPassword: {
            password: 'Secr3tP4ssw0rdN3w!',
            changeRequired: false,
          },
          // currentPassword: "Secr3tP4ssw0rd!",
          verificationCode: passwordResetCode ?? undefined,
        },
      )

      expectTypeOf(createPasswordByVerificationCode).toEqualTypeOf<ZITADEL.ZitadelUserPasswordCreateResponse>()
      console.log('✓ Human user password created successfully using verification code')
    }
    catch (error) {
      console.error('❌ Human user password creation failed:', error)
      throw error
    }
  })

  it('should create human user password with current password', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const createPasswordByCurrentPassword = await zitadelClient.createUserPassword(
        {
          userId: testHumanUser.userId,
        },
        {
          newPassword: {
            password: 'Secr3tP4ssw0rd!',
            changeRequired: false,
          },
          currentPassword: 'Secr3tP4ssw0rdN3w!',
          // verificationCode: passwordResetCode ?? undefined,
        },
      )

      expectTypeOf(createPasswordByCurrentPassword).toEqualTypeOf<ZITADEL.ZitadelUserPasswordCreateResponse>()
      console.log('✓ Human user password created successfully using current password')
    }
    catch (error) {
      console.error('❌ Human user password creation failed:', error)
      throw error
    }
  })

  it('should resend human user email verification code to email', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const resendVerificationCode = await zitadelClient.resendUserEmailVerificationCode(
        {
          userId: testHumanUser.userId,
        },
        {
          sendCode: {
            urlTemplate: 'https://example.com/email/verify?userID={{.UserID}}&code={{.Code}}&orgID={{.OrgID}}',
          },
        },
      )
      expectTypeOf(resendVerificationCode).toEqualTypeOf<ZITADEL.ZitadelUserResendVerifyCodeByEmailPostResponse>()
      console.log('✓ Human user email verification code sent by email successfully')
    }
    catch (error) {
      console.error('❌ Human user email verification code resend failed:', error)
      throw error
    }
  })

  it('should return human user email verification code', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const returnVerificationCode = await zitadelClient.resendUserEmailVerificationCode(
        {
          userId: testHumanUser.userId,
        },
        {
          returnCode: {},
        },
      )
      expectTypeOf(returnVerificationCode).toEqualTypeOf<ZITADEL.ZitadelUserResendVerifyCodeByEmailPostResponse>()
      console.log('✓ Human user email verification code returned successfully, CODE:', returnVerificationCode.verificationCode)
    }
    catch (error) {
      console.error('❌ Human user email verification code resend failed:', error)
      throw error
    }
  })

  it('should resend/return human user phone verification code', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const resendVerificationCode = await zitadelClient.resendUserPhoneVerificationCode(
        {
          userId: testHumanUser.userId,
        },
        {
          // sendCode: {},
          returnCode: {},
        },
      )
      expectTypeOf(resendVerificationCode).toEqualTypeOf<ZITADEL.ZitadelUserResendVerifyCodeByPhonePostResponse>()
      console.log('✓ Human user phone verification code resent successfully, CODE:', resendVerificationCode.verificationCode)
    }
    catch (error) {
      console.error('❌ Human user phone verification code resend failed:', error)
      throw error
    }
  })

  it('should get user authentication methods', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const authenticationMethods = await zitadelClient.getUserAuthMethods(
        {
          userId: testHumanUser.userId,
        },
        {
          includeWithoutDomain: true,
          domain: 'localhost',
        },
      )
      expectTypeOf(authenticationMethods).toEqualTypeOf<ZITADEL.ZitadelUserAuthenticationMethodsGetResponse>()
      console.log('✓ User authentication methods retrieved successfully, METHODS:', authenticationMethods.authMethodTypes)
    }
    catch (error) {
      console.error('❌ User authentication methods retrieval failed:', error)
      throw error
    }
  })

  it('should remove the configured TOTP generator of a user', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const removeTotpGenerator = await zitadelClient.deleteUserTotp(
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(removeTotpGenerator).toEqualTypeOf<ZITADEL.ZitadelUserTotpDeleteResponse>()
      console.log('✓ TOTP generator removed successfully')
    }
    catch (error) {
      console.error('❌ TOTP generator removal failed:', error)
      throw error
    }
  })

  it('should remove u2f token from a user', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const removeU2fToken = await zitadelClient.deleteUserU2fToken(
        {
          userId: testHumanUser.userId,
          u2fId: '123456',
        },
      )
      expectTypeOf(removeU2fToken).toEqualTypeOf<ZITADEL.ZitadelUserU2fDeleteResponse>()
      console.log('✓ U2f token removed successfully')
    }
    catch (error) {
      console.error('❌ U2f token removal failed:', error)
      throw error
    }
  })

  it('should remove the configured One-Time Password (OTP) SMS factor of a user', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const removeOtpSmsFactor = await zitadelClient.deleteUserOtpSms(
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(removeOtpSmsFactor).toEqualTypeOf<ZITADEL.ZitadelUserOtpSmsDeleteResponse>()
      console.log('✓ OTP SMS factor removed successfully')
    }
    catch (error) {
      console.error('❌ OTP SMS factor removal failed:', error)
      throw error
    }
  })

  it('should remove the configured One-Time Password (OTP) Email factor of a user', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const removeOtpEmailFactor = await zitadelClient.deleteUserOtpEmail(
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(removeOtpEmailFactor).toEqualTypeOf<ZITADEL.ZitadelUserOtpEmailDeleteResponse>()
      console.log('✓ OTP Email factor removed successfully')
    }
    catch (error) {
      console.error('❌ OTP Email factor removal failed:', error)
      throw error
    }
  })

  it('should create a passkey registration link which includes a code and either return it or send it to the user', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const createPasskeyRegistrationLink = await zitadelClient.registerUserPasskeyLink(
        {
          userId: testHumanUser.userId,
        },
        {
          /* sendLink: {
            urlTemplate: 'https://example.com/passkey/register?userID={{.UserID}}&orgID={{.OrgID}}&codeID={{.CodeID}}&code={{.Code}}',
          }, */
          returnCode: {},
        },
      )
      expectTypeOf(createPasskeyRegistrationLink).toEqualTypeOf<ZITADEL.ZitadelUserPasskeyLinkRegistrationPostResponse>()
      console.log('✓ Passkey registration link created successfully, CODE:', createPasskeyRegistrationLink.code)
      userPassKey = createPasskeyRegistrationLink.code
    }
    catch (error) {
      console.error('❌ Passkey registration link creation failed:', error)
      throw error
    }
  })

  it('should list passkeys of an user', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const listPasskeys = await zitadelClient.getUserPasskeys(
        {
          userId: testHumanUser.userId,
        },
        {},
      )
      expectTypeOf(listPasskeys).toEqualTypeOf<ZITADEL.ZitadelUserPasskeysGetResponse>()
      console.log('✓ Passkeys listed successfully, PASS_KEYS:', listPasskeys.result)
    }
    catch (error) {
      console.error('❌ Passkeys listing failed:', error)
      throw error
    }
  })

  it('should start the registration of a passkey for a user', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const startPasskeyRegistration = await zitadelClient.registerUserPasskey(
        {
          userId: testHumanUser.userId,
        },
        {
          code: {
            id: userPassKey.id,
            code: userPassKey.code,
          },
          authenticator: AuthenticatorType.UNSPECIFIED,
          domain: 'localhost',
        },
      )
      expectTypeOf(startPasskeyRegistration).toEqualTypeOf<ZITADEL.ZitadelUserPasskeyRegisterPostResponse>()
      console.log('✓ Passkey registration started successfully, PASSKEY:', { id: startPasskeyRegistration.passkeyId, key: startPasskeyRegistration.publicKeyCredentialCreationOptions })
    }
    catch (error) {
      console.error('❌ Passkey registration failed:', error)
      throw error
    }
  })

  it('should remove passkey from a user', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const removePasskey = await zitadelClient.deleteRegisteredUserPasskey(
        {
          passkeyId: userPassKey.id,
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(removePasskey).toEqualTypeOf<ZITADEL.ZitadelUserPasskeyDeleteResponse>()
      console.log('✓ Passkey removed successfully')
    }
    catch (error) {
      console.error('❌ Passkey removal failed:', error)
      throw error
    }
  })

  // todo: according to the documentation it should return metadata id in the response but it doesn't. must be verified
  it('should create user metadata by key', async () => {
    try {
      const randomTwoDigitNumber = Math.floor(Math.random() * 100)
      const metadata = Object.assign({}, {
        key: `test-key-${randomTwoDigitNumber}`,
        value: `test-value-${randomTwoDigitNumber}`,
      })
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const userMetadata = await zitadelClient.createMetadataByKey(
        {
          key: metadata.key,
          userId: testHumanUser.userId,
        },
        {
          value: metadata.value,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(userMetadata).toEqualTypeOf<ZITADEL.ZitadelUserMetadataByKeyCreateResponse>()
      console.log('✓ User metadata created successfully')
      singleMetadata = metadata
    }
    catch (error) {
      console.error('❌ User metadata creation failed:', error)
      throw error
    }
  })

  it('should create user metadata by key bulk', async () => {
    try {
      const randomTwoDigitNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 100))
      const bulkMetadata = randomTwoDigitNumbers.map(randomTwoDigitNumber => ({
        key: `test-key-${randomTwoDigitNumber}`,
        value: `test-value-${randomTwoDigitNumber}`,
      }))
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const userMetadataBulk = await zitadelClient.createBulkMetadataByKey(
        {
          userId: testHumanUser.userId,
        },
        {
          metadata: bulkMetadata,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(userMetadataBulk).toEqualTypeOf<ZITADEL.ZitadelUserMetadataByKeyBulkCreateResponse>()
      console.log('✓ User metadata bulk created successfully')
      multipleMetadata = bulkMetadata
    }
    catch (error) {
      console.error('❌ User metadata creation failed:', error)
      throw error
    }
  })

  it('should get user metadata by key', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const userMetadata = await zitadelClient.getMetadataByKey(
        {
          userId: testHumanUser.userId,
          key: singleMetadata.key,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(userMetadata).toEqualTypeOf<ZITADEL.ZitadelUserMetadataByKeyGetResponse>()
      console.log('✓ User metadata by key retrieved successfully, VALUE:', userMetadata.metadata.value)
    }
    catch (error) {
      console.error('❌ User metadata retrieval failed:', error)
      throw error
    }
  })

  it('should search user metadata by query', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const userMetadata = await zitadelClient.userMetadataSearch(
        {
          userId: testHumanUser.userId,
        },
        {
          query: {
            offset: '0',
            limit: 100,
            asc: true,
          },
          queries: [
            {
              keyQuery: {
                key: singleMetadata.key,
                method: ZitadelTextQueryMethod.EQUALS_IGNORE_CASE,
              },

            },
            {
              keyQuery: {
                key: 't',
                method: ZitadelTextQueryMethod.STARTS_WITH_IGNORE_CASE,
              },
            },
          ],
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(userMetadata).toEqualTypeOf<ZITADEL.ZitadelUserMetadataSearchGetResponse>()
      console.log('✓ User metadata by query retrieved successfully, COUNT:', userMetadata.result.length)
    }
    catch (error) {
      console.error('❌ User metadata search failed:', error)
      throw error
    }
  })

  it('should delete user avatar', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const response = await zitadelClient.deleteUserAvatar(
        {
          userId: testHumanUser.userId,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(response).toEqualTypeOf<ZITADEL.ZitadelUserAvatarDeleteResponse>()
      console.log('✓ User avatar deleted successfully')
    }
    catch (error) {
      console.error('❌ User avatar deletion failed:', error)
      throw error
    }
  })

  it('should delete user metadata by key', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const userMetadata = await zitadelClient.deleteMetadataByKey(
        {
          userId: testHumanUser.userId,
          key: singleMetadata.key,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(userMetadata).toEqualTypeOf<ZITADEL.ZitadelUserMetadataByKeyDeleteResponse>()
      console.log('✓ User metadata by key deleted successfully')
    }
    catch (error) {
      console.error('❌ User metadata deletion failed:', error)
      throw error
    }
  })

  it('should bulk delete user metadata by key', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const bulkMetadata = await zitadelClient.deleteBulkMetadataByKey(
        {
          userId: testHumanUser.userId,
        },
        {
          keys: multipleMetadata.map(metadata => metadata.key),
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(bulkMetadata).toEqualTypeOf<ZITADEL.ZitadelUserMetadataByKeyBulkDeleteResponse>()
      console.log('✓ User metadata by key bulk deleted successfully')
    }
    catch (error) {
      console.error('❌ User metadata bulk deletion failed:', error)
      throw error
    }
  })

  it('should get user by ID', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const user = await zitadelClient.getUserById(
        {
          userId: testHumanUser.userId,
        },
      )
      expectTypeOf(user).toEqualTypeOf<ZITADEL.ZitadelUserByIdGetResponse>()
      console.log('✓ User retrieved successfully with ID:', user.user.userId)
      // retrievedHumanUser = user
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
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
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
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
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
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
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
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
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
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
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
      // testOidcApp = oidcApp
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

  it('should create machine user secret', async () => {
    try {
      const machineUserSecretCreate = await zitadelClient.createMachineUserSecret(
        {
          userId: testMachineUser.userId,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(machineUserSecretCreate).toEqualTypeOf<ZITADEL.ZitadelMachineUserSecretCreateResponse>()
      console.log('✓ Machine user secret created successfully, CLIENT_SECRET:', machineUserSecretCreate.clientSecret)
    }
    catch (error) {
      console.error('❌ Machine user secret creation failed:', error)
      throw error
    }
  })

  it('should delete machine user secret', async () => {
    try {
      const machineUserSecretDelete = await zitadelClient.deleteMachineUserSecret(
        {
          userId: testMachineUser.userId,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(machineUserSecretDelete).toEqualTypeOf<ZITADEL.ZitadelMachineUserSecretDeleteResponse>()
      console.log('✓ Machine user secret deleted successfully')
    }
    catch (error) {
      console.error('❌ Machine user secret deletion failed:', error)
      throw error
    }
  })

  it('should update a machine user', async () => {
    try {
      const machineUser = await zitadelClient.updateMachineUser(
        {
          userId: testMachineUser.userId,
        },
        {
          name: 'Updated Machine User',
          description: 'Updated machine user description',
          accessTokenType: ZitadelMachineUserAccessTokenType.BEARER,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(machineUser).toEqualTypeOf<ZITADEL.ZitadelMachineUserUpdateResponse>()
      console.log(`✓ Machine user updated successfully, ID: ${testMachineUser.userId}`)
    }
    catch (error) {
      console.error('❌ Machine user update failed:', error)
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
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
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

  it('should update human user', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
      const updatedUser = await zitadelClient.updateHumanUser(
        {
          userId: testHumanUser.userId,
        },
        {
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
        },
      )
      expectTypeOf(updatedUser).toEqualTypeOf<ZITADEL.ZitadelHumanUserUpdateResponse>()
      console.log('✓ User updated successfully')
    }
    catch (error) {
      console.error('❌ User update failed:', error)
      throw error
    }
  })

  it('should delete machine user key', async () => {
    try {
      const machineUserKey = await zitadelClient.deleteMachineUserKey(
        {
          keyId: testMachineUserKey.keyId,
          userId: testMachineUser.userId,
        },
        {
          'x-zitadel-orgid': testOrganization.organizationId,
        },
      )
      expectTypeOf(machineUserKey).toEqualTypeOf<ZITADEL.ZitadelMachineUserKeyDeleteResponse>()
      console.log('✓ Machine user key deleted successfully')
    }
    catch (error) {
      console.error('❌ Machine user key deletion failed:', error)
      throw error
    }
  })

  it('should delete a user', async () => {
    try {
      if (!testHumanUser.userId)
        throw new Error('User ID is not defined')
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
