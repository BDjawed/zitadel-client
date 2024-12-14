/* eslint no-console: "off" */
import fs from 'node:fs'
import process from 'node:process'
import * as ZITADEL from '@creoox-public/zitadel-client'
import * as dotenv from 'dotenv'
import {
  ZitadelSearchUsersSortingColumn,
  ZitadelTextQueryMethod,
} from '../../../src/enums'

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

  const searchQuery = 'cre'

  console.log('Start search users by query: ', searchQuery)

  const zitadelClient = new ZITADEL.ZitadelClient({
    issuerUrl: ZITADEL_INSTANCE_URL,
    privateJwtKeyPath: ZITEDEL_KEY_FILE_PATH,
  })

  await zitadelClient.setup()

  const creLandOrganization = ZITADEL_PROVISIONING_RESPONSE_FILE.creLandOrganization

  const creLandQueryResponse: ZITADEL.ZitadelSearchUsersPostResponse
    = await zitadelClient.usersSearch(
      {
        query: {
          offset: '0',
          limit: 10,
          asc: true,
        },
        sortingColumn: ZitadelSearchUsersSortingColumn.UNSPECIFIED,
        queries: [
          {
            nickNameQuery: {
              nickName: searchQuery,
              method: ZitadelTextQueryMethod.STARTS_WITH_IGNORE_CASE,
            },
          },
        ],
      },
      {
        'x-zitadel-orgid': creLandOrganization.organizationId,
      },
    )
  console.log(
    'creLandQueryResponse',
    JSON.stringify(creLandQueryResponse, null, 2),
  )
}
main()
