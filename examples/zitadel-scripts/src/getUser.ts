/* eslint no-console: "off" */
import fs from 'node:fs'
import process from 'node:process'
import * as ZITADEL from '@creoox-public/zitadel-client'
import * as dotenv from 'dotenv'

dotenv.config()

const ZITADEL_INSTANCE_URL = process.env.ZITADEL_INSTANCE_URL
const ZITEDEL_KEY_FILE_PATH = process.env.ZITEDEL_KEY_FILE_PATH

const ZITADEL_PROVISIONING_RESPONSE_FILE_PATH = process.env
  .ZITADEL_PROVISIONING_RESPONSE_FILE_PATH
  ? process.env.ZITADEL_PROVISIONING_RESPONSE_FILE_PATH
  : './zitadel-provisioning-response.json'
const ZITADEL_PROVISIONING_RESPONSE_FILE = JSON.parse(
  fs.readFileSync(ZITADEL_PROVISIONING_RESPONSE_FILE_PATH, 'utf8'),
)

async function main(): Promise<void> {
  if (
    !(
      ZITADEL_INSTANCE_URL
      && ZITEDEL_KEY_FILE_PATH
      && ZITADEL_PROVISIONING_RESPONSE_FILE
      && Array.isArray(ZITADEL_PROVISIONING_RESPONSE_FILE.machineUsers)
      && ZITADEL_PROVISIONING_RESPONSE_FILE.machineUsers.length > 0
      && ZITADEL_PROVISIONING_RESPONSE_FILE.creDashboardProject
      && ZITADEL_PROVISIONING_RESPONSE_FILE.creLandOrganization
      && ZITADEL_PROVISIONING_RESPONSE_FILE.creLandOrganization.organizationId
      && ZITADEL_PROVISIONING_RESPONSE_FILE.creLandHumanUser
      && ZITADEL_PROVISIONING_RESPONSE_FILE.creLandHumanUser.userId
    )
  ) {
    throw new Error(
      'Please provide ZITADEL_INSTANCE_URL, ZITEDEL_KEY_FILE_PATH in .env file and run pnpm provisioning first',
    )
  }
  console.log('Starting fetching users by login name...')

  const zitadelClient = new ZITADEL.ZitadelClient({
    issuerUrl: ZITADEL_INSTANCE_URL,
    privateJwtKeyPath: ZITEDEL_KEY_FILE_PATH,
  })

  await zitadelClient.setup()

  const creLandOrganization = ZITADEL_PROVISIONING_RESPONSE_FILE.creLandOrganization

  const creLandMachineUsers: ZITADEL.ZitadelUserByIdGetResponse['user'][] = []

  // Get machine users information by their id
  for (const machineUser of ZITADEL_PROVISIONING_RESPONSE_FILE.machineUsers) {
    const { userId } = machineUser.machineUser
    const creLandMachineUserInfo = await zitadelClient.getUserById(
      {
        userId,
      },
      {
        'x-zitadel-orgid': creLandOrganization.organizationId,
      },
      {
        projectId: ZITADEL_PROVISIONING_RESPONSE_FILE.creDashboardProject.id,
      },
    )
    creLandMachineUsers.push(creLandMachineUserInfo.user)
  }

  console.log('CreLand Machine Users info', creLandMachineUsers)

  // Get human users information by their id
  const creLandHumanUserInfo = await zitadelClient.getUserById(
    {
      userId: ZITADEL_PROVISIONING_RESPONSE_FILE.creLandHumanUser.userId,
    },
    {
      'x-zitadel-orgid': creLandOrganization.organizationId,
    },
    { projectId: ZITADEL_PROVISIONING_RESPONSE_FILE.creDashboardProject.id },
  )
  console.log('CreLand Human User Info', creLandHumanUserInfo)

  // Get human users information by their login name
  console.log('creLandHumanUserInfo.loginNames', creLandHumanUserInfo.user)
  for (const loginName of creLandHumanUserInfo.user.loginNames) {
    const humanUserByLoginName = await zitadelClient.getUserByLoginName({
      loginName,
    })
    console.log('CreLand Human User By Login Name Info', humanUserByLoginName)
  }

  // get machine users information by their login name
  for (const machineUser of creLandMachineUsers) {
    for (const loginName of machineUser.loginNames) {
      const machineUserByLoginName = await zitadelClient.getUserByLoginName({
        loginName,
      })
      console.log('CreLand Machine User By Login Name Info', machineUserByLoginName)
    }
  }
}
main()
