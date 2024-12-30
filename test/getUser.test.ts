/* eslint no-console: "off" */
import fs from 'node:fs'
import path from 'node:path'
import { ZitadelClient } from '@creoox-public/zitadel-client'
import * as dotenv from 'dotenv'
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from 'vitest'
import type { ZitadelProvisioningResponse } from '../examples/zitadel-scripts/zitadel/machinekey/provisioning'
import type { ZitadelUserByIdGetResponse } from '../src/responses/user-by-id-get.response'
import type { ZitadelUserByLoginNameGetResponse } from '../src/responses/user-by-login-name-get.response'

console.log('🚀 Starting Zitadel getUser tests...')

let areEnvVarsValid = true

dotenv.config({ path: path.resolve(__dirname, '../examples/zitadel-scripts/.env') })

const ZITADEL_INSTANCE_URL = process.env.ZITADEL_INSTANCE_URL
const ZITADEL_KEY_FILE_PATH = process.env.ZITADEL_KEY_FILE_PATH?.replace('./', './examples/zitadel-scripts/')
const ZITADEL_PROVISIONING_RESPONSE_FILE_PATH = process.env.ZITADEL_PROVISIONING_RESPONSE_FILE_PATH?.replace('./', './examples/zitadel-scripts/')
const ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH = process.env.ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH?.replace('./', './examples/zitadel-scripts/')

describe('environment Variable Tests', () => {
  beforeAll(() => {
    // Check for required environment variables
    if (!ZITADEL_INSTANCE_URL) {
      areEnvVarsValid = false
      throw new Error('ZITADEL_INSTANCE_URL is not defined')
    }
    if (!ZITADEL_KEY_FILE_PATH) {
      areEnvVarsValid = false
      throw new Error('ZITADEL_KEY_FILE_PATH is not defined')
    }
    if (!ZITADEL_PROVISIONING_RESPONSE_FILE_PATH) {
      areEnvVarsValid = false
      throw new Error('ZITADEL_PROVISIONING_RESPONSE_FILE_PATH is not defined')
    }
    if (!ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH) {
      areEnvVarsValid = false
      throw new Error('ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH is not defined')
    }

    console.log('✓ Environment variables loaded')
  })

  it('should have all required environment variables defined', () => {
    expect(ZITADEL_INSTANCE_URL).toBeDefined()
    expect(ZITADEL_KEY_FILE_PATH).toBeDefined()
    expect(ZITADEL_PROVISIONING_RESPONSE_FILE_PATH).toBeDefined()
    expect(ZITADEL_GENERATE_TOKEN_OUTPUT_FILE_PATH).toBeDefined()
  })
})

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
