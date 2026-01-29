import { execSync } from 'child_process'
import 'dotenv/config'
import { Pool } from 'pg'

const READONLY_USER_PASSWORD = process.env.READONLY_USER_PASSWORD

interface SqdParams {
  host: string
  port: number
  database: string
  user: string
  password: string
}

interface SqdOutput {
  addons: {
    postgres: {
      connections: Array<{
        params: SqdParams
      }>
    }
  }
}

async function setupReadonlyUser() {
  if (!READONLY_USER_PASSWORD) {
    console.log('READONLY_USER_PASSWORD not set, skipping readonly user setup')
    return
  }

  // Get SQD credentials
  const sqdOutput = execSync('sqd view -o origin -n origin-squid -t prod --json', { encoding: 'utf8' })
  const sqd: SqdOutput = JSON.parse(sqdOutput)
  const params = sqd.addons.postgres.connections[0].params

  const pool = new Pool({
    host: params.host,
    port: params.port,
    database: params.database,
    user: params.user,
    password: params.password,
  })

  try {
    console.log('Setting up readonly_user...')

    // Check if role already exists
    const roleExists = await pool.query(`SELECT 1 FROM pg_roles WHERE rolname = 'readonly_user'`)

    if (roleExists.rows.length === 0) {
      // Create the readonly user role
      await pool.query(`
        CREATE ROLE readonly_user WITH
          LOGIN
          NOSUPERUSER
          NOCREATEDB
          NOCREATEROLE
          NOINHERIT
          NOREPLICATION
          PASSWORD '${READONLY_USER_PASSWORD}'
      `)
      console.log('Created readonly_user role')
    } else {
      // Update password if role exists
      await pool.query(`ALTER ROLE readonly_user WITH PASSWORD '${READONLY_USER_PASSWORD}'`)
      console.log('Updated readonly_user password')
    }

    // Grant connect privilege on the database
    await pool.query(`GRANT CONNECT ON DATABASE "${params.database}" TO readonly_user`)
    console.log(`Granted CONNECT on database ${params.database}`)

    // Grant usage on the schema
    await pool.query(`GRANT USAGE ON SCHEMA public TO readonly_user`)
    console.log('Granted USAGE on schema public')

    // Grant SELECT on all existing tables in the schema
    await pool.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user`)
    console.log('Granted SELECT on all tables')

    // Grant SELECT on all existing sequences
    await pool.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly_user`)
    console.log('Granted SELECT on all sequences')

    // Set default privileges for future tables
    await pool.query(`
      ALTER DEFAULT PRIVILEGES IN SCHEMA public
        GRANT SELECT ON TABLES TO readonly_user
    `)
    console.log('Set default privileges for future tables')

    await pool.query(`
      ALTER DEFAULT PRIVILEGES IN SCHEMA public
        GRANT SELECT ON SEQUENCES TO readonly_user
    `)
    console.log('Set default privileges for future sequences')

    console.log('Readonly user setup complete')
  } catch (error) {
    console.error('Error setting up readonly user:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

void setupReadonlyUser()
