/* eslint no-console: "off" */
import fs from 'node:fs'
import process from 'node:process'
import * as ZITADEL from '@creoox-public/zitadel-client'
import * as dotenv from 'dotenv'

dotenv.config()

const ZITADEL_INSTANCE_URL = process.env.ZITADEL_INSTANCE_URL
const ZITADEL_KEY_FILE_PATH = process.env.ZITADEL_KEY_FILE_PATH

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
      && ZITADEL_KEY_FILE_PATH
      && ZITADEL_PROVISIONING_RESPONSE_FILE
    )
  ) {
    throw new Error(
      'Please provide ZITADEL_INSTANCE_URL, ZITADEL_KEY_FILE_PATH in .env file and run pnpm provisioning first',
    )
  }
  console.log('Deleting user by id...')

  const randomName = Math.random().toString(36).substring(7)

  const creLand = {
    creMachineUser: 'creToBeDeleted',
  }

  const zitadelClient = new ZITADEL.ZitadelClient({
    issuerUrl: ZITADEL_INSTANCE_URL,
    privateJwtKeyPath: ZITADEL_KEY_FILE_PATH,
  })

  await zitadelClient.setup()

  const creLandOrganization = ZITADEL_PROVISIONING_RESPONSE_FILE.creLandOrganization

  // Create a machine user
  const machineUser = await zitadelClient.createMachineUser(
    {
      userName: `${creLand.creMachineUser}_${randomName}`,
      name: creLand.creMachineUser,
      description: `Machine user for  ${creLand.creMachineUser}`,
      accessTokenType: ZITADEL.ZitadelMachineUserAccessTokenType.JWT,
    },
    {
      'x-zitadel-orgid': creLandOrganization.organizationId,
    },
  )

  console.log('created test machine user: ', machineUser)

  // Delete the machine user previously created by it's id
  const deleteMachineUser = await zitadelClient.deleteUserById(
    {
      userId: machineUser.userId,
    },
    {
      'x-zitadel-orgid': creLandOrganization.organizationId,
    },
    {
      projectId: ZITADEL_PROVISIONING_RESPONSE_FILE.creDashboardProject.id,
    },
  )

  console.log('Deleted machine user: ', deleteMachineUser)
}

main()
