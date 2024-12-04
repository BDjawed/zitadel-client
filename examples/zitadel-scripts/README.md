**Make sure you got ZITADEL instance running.**

Prerequisite: ZITADEL instance.

You can spin one for free att

**Env file**

Inside ./packages/zitadel-scripts

Create `.env` file from `.env.example`

**Provisioning**

To provision ZITADEL instance run

`pnpm run provision`

It will create required objects and create log at path ZITADEL_PROVISIONING_RESPONSE_FILE_PATH

Use createt PAT (Personal access tokent) to secure you environmnet

**Generate token**

To generate PAT for developer or customer run

`pnpm run generate-token <path_to_input> <organization id>`

Example:

`pnpm run generate-token ./zitadel/customers/inputs/example.corp.json 294307179215716368`
