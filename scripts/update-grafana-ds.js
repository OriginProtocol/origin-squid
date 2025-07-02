// scripts/update-grafana-ds.js

const { execSync } = require('child_process')
const fetch = require('node-fetch')

// Load secrets from environment
const GRAFANA_TOKEN = process.env.GRAFANA_TOKEN
const GRAFANA_URL = 'https://grafana.originprotocol.com'
const DATASOURCE_ID = 22
const DATASOURCE_UID = 'cdjqw6cqd1gqob'

async function main() {
  // Step 1: Get SQD credentials
  const sqdOutput = execSync('sqd view -o origin -n origin-squid -t prod --json', { encoding: 'utf8' })
  const sqd = JSON.parse(sqdOutput)
  const params = sqd.addons.postgres.connections[0].params

  // Step 2: Fetch current datasource
  const res = await fetch(`${GRAFANA_URL}/api/datasources/${DATASOURCE_ID}`, {
    headers: {
      Authorization: `Bearer ${GRAFANA_TOKEN}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch datasource: ${res.status} ${await res.text()}`)
  }

  const ds = await res.json()

  // Step 3: Update credentials
  ds.user = params.user
  ds.database = params.database
  ds.password = params.password
  ds.version += 1

  // Step 4: PUT updated datasource
  const putRes = await fetch(`${GRAFANA_URL}/api/datasources/uid/${DATASOURCE_UID}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GRAFANA_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ds),
  })

  if (!putRes.ok) {
    throw new Error(`PUT failed: ${putRes.status} ${await putRes.text()}`)
  }

  console.log('✅ Grafana datasource updated successfully.')
}

main().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
