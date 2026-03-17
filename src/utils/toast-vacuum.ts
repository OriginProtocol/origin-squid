import { Pool } from 'pg'

const TOAST_THRESHOLD_BYTES = 1_000_000_000 // 1 GB
const CHECK_INTERVAL_MS = 30 * 60 * 1000 // 30 minutes

interface ToastInfo {
  schema_name: string
  table_name: string
  toast_table: string
  toast_size: string
  toast_bytes: number
}

async function checkAndVacuumToast(pool: Pool): Promise<void> {
  const client = await pool.connect()
  try {
    const result = await client.query<ToastInfo>(`
      SELECT
        n.nspname AS schema_name,
        c.relname AS table_name,
        t.relname AS toast_table,
        pg_size_pretty(pg_relation_size(t.oid)) AS toast_size,
        pg_relation_size(t.oid) AS toast_bytes
      FROM pg_class c
      JOIN pg_class t ON t.oid = c.reltoastrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE t.relkind = 't'
      ORDER BY pg_relation_size(t.oid) DESC
      LIMIT 20
    `)

    for (const row of result.rows) {
      console.log(`[toast-vacuum] ${row.schema_name}.${row.table_name}: TOAST ${row.toast_size}`)
    }

    const bloated = result.rows.filter((r) => r.toast_bytes > TOAST_THRESHOLD_BYTES)
    for (const row of bloated) {
      console.log(
        `[toast-vacuum] TOAST bloat detected on ${row.schema_name}.${row.table_name} (${row.toast_size}), running VACUUM FULL...`,
      )
      const start = Date.now()
      await client.query(`VACUUM FULL VERBOSE "${row.schema_name}"."${row.table_name}"`)
      const elapsed = ((Date.now() - start) / 1000).toFixed(1)
      console.log(`[toast-vacuum] VACUUM FULL on ${row.schema_name}.${row.table_name} completed in ${elapsed}s`)
    }

    if (bloated.length === 0) {
      console.log('[toast-vacuum] No TOAST bloat detected.')
    }
  } catch (err) {
    console.error('[toast-vacuum] Error during TOAST check:', err)
  } finally {
    client.release()
  }
}

export function startToastVacuumMonitor(): void {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectionTimeoutMillis: 60000,
    idleTimeoutMillis: 600000,
    query_timeout: 3600000, // 1 hour — VACUUM FULL can take a while
    statement_timeout: 3600000,
  })

  // Run immediately on launch
  checkAndVacuumToast(pool).then(() => {
    // Then repeat every 30 minutes
    setInterval(() => {
      checkAndVacuumToast(pool)
    }, CHECK_INTERVAL_MS)
  })
}
