/* eslint no-console: "off" */
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import process from 'node:process'
import * as ZITADEL from '@creoox-public/zitadel-client'
import * as dotenv from 'dotenv'
import type { ZitadelUserMetadata } from '@creoox-public/zitadel-client'

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
  console.log('Bulk Creating metadata by key...')

  const zitadelClient = new ZITADEL.ZitadelClient({
    issuerUrl: ZITADEL_INSTANCE_URL,
    privateJwtKeyPath: ZITADEL_KEY_FILE_PATH,
  })

  await zitadelClient.setup()

  const creLandOrganization = ZITADEL_PROVISIONING_RESPONSE_FILE.creLandOrganization

  const generateRandomKey = (): string => Array.from({ length: 6 }, () => Math.random().toString(36)[2]).join('')

  const generateBase64Value = (value: string): string => Buffer.from(value).toString('base64')

  const generateMetadataArray = (count: number): ZitadelUserMetadata[] => {
    const value = 'metadata value bulk created'
    const metadataArray: ZitadelUserMetadata[] = []

    for (let i = 0; i < count; i++) {
      const randomKey = generateRandomKey()
      const base64Value = generateBase64Value(value)
      metadataArray.push({
        key: randomKey,
        value: base64Value,
      })
    }

    return metadataArray
  }

  const metadataArray = generateMetadataArray(4)

  const metadata = await zitadelClient.createBulkMetadataByKey(
    {
      userId: ZITADEL_PROVISIONING_RESPONSE_FILE.creLandHumanUser.userId,
      metadata: metadataArray,
    },
    {
      'x-zitadel-orgid': creLandOrganization.organizationId,
    },
  )

  console.log('Created metadata response: ', metadata)
}
main()
