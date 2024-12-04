/* eslint-disable ts/no-redeclare */
/* eslint no-console: "off" */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import * as ZITADEL from '@creoox-public/zitadel-client'

import chalk from 'chalk'
import * as dotenv from 'dotenv'

import { z } from 'zod'

const Customer = z.object({
  organizationName: z.string(),
  machineUserName: z.string(),
  patExpirationDate: z.coerce.date(),
})

type Customer = z.infer<typeof Customer>

dotenv.config()

const ZITADEL_INSTANCE_URL = process.env.ZITADEL_INSTANCE_URL
const ZITEDEL_KEY_FILE_PATH = process.env.ZITEDEL_KEY_FILE_PATH
const ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH = process.env.ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH

async function main(): Promise<void> {
  if (!ZITADEL_INSTANCE_URL || !ZITEDEL_KEY_FILE_PATH || !ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH) {
    throw new Error(
      'Please provide ZITADEL_INSTANCE_URL, ZITEDEL_KEY_FILE_PATH, ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH env file',
    )
  }

  const args = process.argv

  const consumerInput = args[2]
  const creLandOrganizationId = args[3]

  console.log(chalk.blue('Parsed args: ', consumerInput, creLandOrganizationId))

  // Check if consumer input is provided and it is a valid path
  if (!consumerInput || !fs.existsSync(consumerInput)) {
    throw new Error('Please provide a valid path to the consumer input file')
  }

  const fileName = path.basename(consumerInput)
  const outputFileJsonLog = path.join(ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH, fileName)

  // Check if creLandOrganizationId is provided
  if (!creLandOrganizationId) {
    throw new Error('Please provide creLandOrganizationId')
  }

  // Read consumer input file
  const input = fs.readFileSync(consumerInput, 'utf-8')
  const customer: Customer = Customer.parse(JSON.parse(input))

  // Initailize Zitadel client
  const zitadelClient = new ZITADEL.ZitadelClient({
    issuerUrl: ZITADEL_INSTANCE_URL,
    privateJwtKeyPath: ZITEDEL_KEY_FILE_PATH,
  })

  await zitadelClient.setup()

  const script_log = {
    organization: null as unknown,
    machineUser: null as unknown,
    pat: null as unknown,
  }

  // Create customer organization

  const organization = await zitadelClient.createOrganization({
    name: customer.organizationName,
  })

  script_log.organization = organization

  // Create machine user
  const machineUser = await zitadelClient.createMachineUser(
    {
      userName: customer.machineUserName,
      name: customer.machineUserName,
      description: `Machine user for ${customer.machineUserName}`,
      accessTokenType: ZITADEL.ZitadelMachineUserAccessTokenType.JWT,
    },
    {
      'x-zitadel-orgid': organization.organizationId,
    },
  )

  script_log.machineUser = machineUser

  // Create Pat
  const pat = await zitadelClient.createMachineUserPAT(
    {
      expirationDate: new Date(customer.patExpirationDate),
    },
    {
      'x-zitadel-orgid': organization.organizationId,
    },
    {
      userId: machineUser.userId,
    },
  )

  script_log.pat = pat

  // Write provision log to file
  fs.writeFileSync(outputFileJsonLog, JSON.stringify(script_log, null, 2))

  console.log(chalk.green('Script executed successfully'))
  console.log(chalk.green('Output file: ', outputFileJsonLog))
}
main()
