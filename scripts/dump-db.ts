import { exec } from 'child_process'
import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { Pool } from 'pg'
import { promisify } from 'util'

const execAsync = promisify(exec)

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || '23798'
const DB_NAME = process.env.DB_NAME || 'squid'
const DB_USER = process.env.DB_USER || 'postgres'
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres'

async function getBlockHeight(processorName: string): Promise<number> {
  const pool = new Pool({
    host: DB_HOST,
    port: parseInt(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  })

  try {
    const result = await pool.query(`SELECT height FROM "${processorName}".status`)

    if (result.rows.length === 0) {
      throw new Error(`No status found for processor: ${processorName}`)
    }

    return result.rows[0].height
  } finally {
    await pool.end()
  }
}

async function dumpDatabase(processorName: string) {
  try {
    if (!DB_PASSWORD) {
      throw new Error('DB_PASSWORD environment variable is required')
    }

    // Get block height for the processor
    const blockHeight = await getBlockHeight(processorName)
    console.log(`Found block height ${blockHeight} for processor ${processorName}`)

    // Create dumps directory if it doesn't exist
    const dumpsDir = path.join(process.cwd(), 'dumps')
    if (!fs.existsSync(dumpsDir)) {
      fs.mkdirSync(dumpsDir)
    }

    // Generate filename with processor name and block height
    const dumpFile = path.join(dumpsDir, `dump_${processorName}_${blockHeight}.dump`)

    // Construct the pg_dump command with custom format, data-only, and public schema only
    const dumpCommand = `PGPASSWORD=${DB_PASSWORD} pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} --data-only -F c -n public --exclude-table-data=migrations -f ${dumpFile}`

    console.log('Starting database data dump...')
    const { stdout, stderr } = await execAsync(dumpCommand)

    if (stderr) {
      console.error('Warning:', stderr)
    }

    console.log(`Database data dump completed successfully. File saved to: ${dumpFile}`)
    console.log('\nTo upload to S3, use the AWS CLI:')
    console.log(`aws s3 cp ${dumpFile} s3://origin-squid/dumps/`)
  } catch (error) {
    console.error('Error dumping database:', error)
    process.exit(1)
  }
}

// Get processor name from command line argument
const processorName = process.argv[2]
if (!processorName) {
  console.error('Please provide the processor name as an argument')
  console.error('Usage: ts-node dump-db.ts <processor-name>')
  process.exit(1)
}

// Fix linter error by properly handling the promise
void dumpDatabase(processorName)
