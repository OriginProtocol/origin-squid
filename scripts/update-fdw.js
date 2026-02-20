// scripts/update-fdw.js

const { execSync } = require('child_process')
const { Client } = require('pg')

const RAILWAY_DATABASE_URL = process.env.RAILWAY_DATABASE_URL

async function main() {
  if (!RAILWAY_DATABASE_URL) {
    throw new Error('RAILWAY_DATABASE_URL is not set')
  }

  // Step 1: Get SQD credentials
  const sqdOutput = execSync('sqd view -o origin -n origin-squid -t prod --json', { encoding: 'utf8' })
  const sqd = JSON.parse(sqdOutput)
  const params = sqd.addons.postgres.connections[0].params

  // Step 2: Connect to Railway database
  const client = new Client({ connectionString: RAILWAY_DATABASE_URL })
  await client.connect()

  // Use client.escapeLiteral() for safe escaping in DDL statements
  const dbname = client.escapeLiteral(params.database)
  const user = client.escapeLiteral(params.user)
  const password = client.escapeLiteral(params.password)

  try {
    // Step 3: Update the foreign server connection details
    await client.query(`ALTER SERVER origin_squid OPTIONS (SET dbname ${dbname})`)

    // Step 4: Update user mapping credentials
    for (const role of ['postgres', 'readonly_user']) {
      await client.query(
        `ALTER USER MAPPING FOR ${role} SERVER origin_squid OPTIONS (SET user ${user}, SET password ${password})`,
      )
    }

    console.log('FDW connection updated successfully.')
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
