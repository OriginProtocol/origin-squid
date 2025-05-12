import { exec } from 'child_process'
import * as fs from 'fs'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function restoreDatabase(dumpFile: string) {
  try {
    // Get database connection details from environment variables
    const DB_HOST = process.env.DB_HOST || 'localhost'
    const DB_PORT = process.env.DB_PORT || '5432'
    const DB_NAME = process.env.DB_NAME || 'origin_squid'
    const DB_USER = process.env.DB_USER || 'postgres'
    const DB_PASSWORD = process.env.DB_PASSWORD

    if (!DB_PASSWORD) {
      throw new Error('DB_PASSWORD environment variable is required')
    }

    // Validate dump file exists
    if (!fs.existsSync(dumpFile)) {
      throw new Error(`Dump file not found: ${dumpFile}`)
    }

    // Construct the psql restore command
    const restoreCommand = `PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${dumpFile}`

    console.log('Starting database data restore...')
    const { stdout, stderr } = await execAsync(restoreCommand)

    if (stderr) {
      console.error('Warning:', stderr)
    }

    console.log('Database data restore completed successfully')
  } catch (error) {
    console.error('Error restoring database:', error)
    process.exit(1)
  }
}

// Get dump file from command line argument
const dumpFile = process.argv[2]
if (!dumpFile) {
  console.error('Please provide the path to the dump file as an argument')
  console.error('Usage: ts-node restore-db.ts <path-to-dump-file>')
  process.exit(1)
}

// Fix linter error by properly handling the promise
void restoreDatabase(dumpFile)
