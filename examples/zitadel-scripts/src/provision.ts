/* eslint no-console: "off" */
import fs from 'node:fs'
import process from 'node:process'
import * as ZITADEL from '@creoox-public/zitadel-client'
import * as dotenv from 'dotenv'

dotenv.config()

const ZITADEL_INSTANCE_URL = process.env.ZITADEL_INSTANCE_URL
const ZITADEL_KEY_FILE_PATH = process.env.ZITADEL_KEY_FILE_PATH
const ZITADEL_HUMAN_USER_PASSWORD = process.env.ZITADEL_HUMAN_USER_PASSWORD
const ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE
  = process.env.ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE

const ZIDATEL_APP_OIDC_REDIRECT_URI = process.env.ZIDATEL_APP_OIDC_REDIRECT_URI

const ZITADEL_PROVISIONING_RESPONSE_FILE_PATH = process.env.ZITADEL_PROVISIONING_RESPONSE_FILE_PATH
  ? process.env.ZITADEL_PROVISIONING_RESPONSE_FILE_PATH
  : './zitadel-provisioning-response.json'

async function main(): Promise<void> {
  if (
    !ZITADEL_INSTANCE_URL
    || !ZITADEL_KEY_FILE_PATH
    || !ZITADEL_HUMAN_USER_PASSWORD
    || !ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE
    || !ZIDATEL_APP_OIDC_REDIRECT_URI
  ) {
    throw new Error(
      'Please provide ZITADEL_INSTANCE_URL, ZITADEL_KEY_FILE_PATH, ZITADEL_HUMAN_USER_PASSWORD, ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE, ZIDATEL_APP_OIDC_REDIRECT_URI in .env file',
    )
  }
  console.log('Starting Zitadel provisioning...')

  const zitadelClient = new ZITADEL.ZitadelClient({
    issuerUrl: ZITADEL_INSTANCE_URL,
    privateJwtKeyPath: ZITADEL_KEY_FILE_PATH,
  })

  await zitadelClient.setup()

  console.log(zitadelClient.getAuthenticationResponse())

  const randomName = Math.random().toString(36).substring(7)

  const creLand = {
    organizationName: `creLand-${randomName}`,
    humanUserName: `creLandAdmin`,
    creDashboardProjectName: `creDashboard`,
    crePaymentsProjectName: `crePayments`,
    creBetaAppName: `creBeta`,
    creAlphaAppName: `creAlpha`,
    creMachineUsers: ['creApi', 'creWorker'],
  }

  console.log(creLand)

  const provision_log = {
    machineUsers: [] as unknown[],
    creLandOrganization: {} as unknown,
    creLandOrganizationName: '',
    creLandHumanUser: {} as unknown,
    creDashboardProject: {} as unknown,
    crePaymentsProject: {} as unknown,
    creBetaOidcApp: {} as unknown,
    creAlphaOidcApp: {} as unknown,
    creAlphaOidcAppName: '',

  }

  // Set default login settings

  try {
    await zitadelClient.updateLoginSettings({
      passwordlessType: ZITADEL.ZitadelPasswordlessType.NOT_ALLOWED,
      forceMfa: false,
      forceMfaLocalOnly: false,
      passwordCheckLifetime: '864000s',
      externalLoginCheckLifetime: '864000s',
      mfaInitSkipLifetime: '2592000s',
      secondFactorCheckLifetime: '64800s',
      multiFactorCheckLifetime: '43200s',
      allowUsernamePassword: true,
      allowRegister: false,
      allowExternalIdp: true,
      hidePasswordReset: true,
      allowDomainDiscovery: true,
      ignoreUnknownUsernames: true,
      disableLoginWithEmail: true,
      disableLoginWithPhone: true,
      defaultRedirectUri: '',
    })
  }
  catch (error) {
    console.log('Error when updating login settings. Probably nothing changed.', error)
  }

  // Create creLand organization
  const creLandOrganization = await zitadelClient.createOrganization({
    name: creLand.organizationName,
  })

  provision_log.creLandOrganization = creLandOrganization
  provision_log.creLandOrganizationName = creLand.organizationName

  // Create creLand admin user
  const creLandHumanUser = await zitadelClient.createHumanUser({
    username: `Customer-human-${randomName}`,
    organization: {
      orgId: creLandOrganization.organizationId,
    },
    profile: {
      givenName: 'creLand',
      familyName: 'Admin',
      nickName: 'creLandAdmin',
      displayName: 'creLandAdmin',
      preferredLanguage: 'en',
      gender: ZITADEL.ZitadelUserGender.UNSPECIFIED,
    },
    email: {
      email: 'tech@creoox.com',
      isVerified: true,
    },
    password: {
      password: ZITADEL_HUMAN_USER_PASSWORD,
      changeRequired: false,
    },
  })

  provision_log.creLandHumanUser = creLandHumanUser

  // Create creLand Projects
  const creDashboardProject = await zitadelClient.createProject(
    {
      name: creLand.creDashboardProjectName,
      projectRoleAssertion: true,
      projectRoleCheck: true,
      hasProjectCheck: true,
      privateLabelingSetting:
        ZITADEL.ZitadelProjectPrivateLabelingSetting.ENFORCE_PROJECT_RESOURCE_OWNER_POLICY,
    },
    {
      'x-zitadel-orgid': creLandOrganization.organizationId,
    },
  )

  provision_log.creDashboardProject = creDashboardProject

  const crePaymentsProject = await zitadelClient.createProject(
    {
      name: creLand.crePaymentsProjectName,
      projectRoleAssertion: true,
      projectRoleCheck: true,
      hasProjectCheck: true,
      privateLabelingSetting:
        ZITADEL.ZitadelProjectPrivateLabelingSetting.ENFORCE_PROJECT_RESOURCE_OWNER_POLICY,
    },
    {
      'x-zitadel-orgid': creLandOrganization.organizationId,
    },
  )

  provision_log.crePaymentsProject = crePaymentsProject

  // Create creLand OIDC Apps
  const creBetaOidcApp = await zitadelClient.createAppOidc(
    {
      name: creLand.creBetaAppName,
      redirectUris: [ZIDATEL_APP_OIDC_REDIRECT_URI],
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
      'x-zitadel-orgid': creLandOrganization.organizationId,
    },
    { projectId: creDashboardProject.id },
  )

  provision_log.creBetaOidcApp = creBetaOidcApp

  const creAlphaOidcApp = await zitadelClient.createAppOidc(
    {
      name: creLand.creAlphaAppName,
      redirectUris: [ZIDATEL_APP_OIDC_REDIRECT_URI],
      responseTypes: [ZITADEL.ZitadelAppOidcResponseType.CODE],
      grantTypes: [ZITADEL.ZitadelAppOidcGrantType.AUTHORIZATION_CODE],
      appType: ZITADEL.ZitadelAppOidcAppType.WEB,
      authMethodType: ZITADEL.ZitadelAppOidcAuthMethodType.POST,
      postLogoutRedirectUris: [],
      version: ZITADEL.ZitadelAppOidcVersionType['1_0'],
      devMode: false,
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
      'x-zitadel-orgid': creLandOrganization.organizationId,
    },
    { projectId: creDashboardProject.id },
  )

  provision_log.creAlphaOidcApp = creAlphaOidcApp
  provision_log.creAlphaOidcAppName = creLand.creAlphaAppName

  // Create creLand Machine Users
  for (const creMachineUser of creLand.creMachineUsers) {
    const machineUser = await zitadelClient.createMachineUser(
      {
        userName: `${creMachineUser}_${randomName}`,
        name: creMachineUser,
        description: `Machine user for  ${creMachineUser}`,
        accessTokenType: ZITADEL.ZitadelMachineUserAccessTokenType.JWT,
      },
      {
        'x-zitadel-orgid': creLandOrganization.organizationId,
      },
    )

    const pat = await zitadelClient.createMachineUserPAT(
      {
        expirationDate: new Date(ZITADEL_MACHINE_USER_PAT_EXPIRATION_DATE),
      },
      {
        'x-zitadel-orgid': creLandOrganization.organizationId,
      },
      {
        userId: machineUser.userId,
      },
    )

    provision_log.machineUsers.push({
      name: creMachineUser,
      machineUser,
      pat,
    })
  }

  // Write provision log to file
  fs.writeFileSync(ZITADEL_PROVISIONING_RESPONSE_FILE_PATH, JSON.stringify(provision_log, null, 2))
}
main()
