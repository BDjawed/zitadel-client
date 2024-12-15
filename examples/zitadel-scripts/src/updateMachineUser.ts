/* eslint no-console: "off" */
import fs from 'node:fs'
import process from 'node:process'
import * as ZITADEL from '@creoox-public/zitadel-client'
import { ZitadelMachineUserAccessTokenType } from '@creoox-public/zitadel-client'
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
      'Please provide ZITADEL_INSTANCE_URL, ZITADEL_KEY_FILE_PATH in .env file and run pnpm provisioning first',
    )
  }
  console.log('Updating Machine User...')

  const zitadelClient = new ZITADEL.ZitadelClient({
    issuerUrl: ZITADEL_INSTANCE_URL,
    privateJwtKeyPath: ZITADEL_KEY_FILE_PATH,
  })

  await zitadelClient.setup()

  const creLandOrganization = ZITADEL_PROVISIONING_RESPONSE_FILE.creLandOrganization

  const updatedCreLandMachineUsers: ZITADEL.ZitadelMachineUserUpdateResponse[] = []

  // Get machine users information by their id
  for (const machineUser of ZITADEL_PROVISIONING_RESPONSE_FILE.machineUsers) {
    const { userId } = machineUser.machineUser
    const randomName = Math.random().toString(36).substring(7)
    const creLandMachineUserUpdateResponse = await zitadelClient.updateMachineUser(
      {
        userId,
        name: `creLandMachineUser-${randomName}`,
        description: `Updated machine user description by script ${new Date().toISOString()}`,
        accessTokenType: ZitadelMachineUserAccessTokenType.BEARER,
      },
      {
        'x-zitadel-orgid': creLandOrganization.organizationId,
      },
    )
    updatedCreLandMachineUsers.push(creLandMachineUserUpdateResponse)
  }

  console.log('CreLand Machine Users Updated', updatedCreLandMachineUsers)
}
main()
