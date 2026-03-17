---
name: db-diagnose
description: Diagnose database issues like TOAST bloat, idle transactions, dead tuples, and disk usage on the Subsquid Cloud PostgreSQL database. Use when the database is slow, bloated, unresponsive, or running out of space.
---

# Database Diagnostics

You are diagnosing database issues for the origin-squid project deployed on Subsquid Cloud.

## Step 1: Get Database Credentials

Run this to get the Subsquid Cloud database connection info:

```bash
npx sqd view -o origin -n origin-squid -t prod --json
```

Parse the JSON output to extract the postgres connection params from `addons.postgres.connections`. Prefer the read/write connection (not read-only) since some diagnostics need it.

Construct a `psql` connection string or use individual params. For running queries use:

```bash
PGPASSWORD=<password> psql -h <host> -p <port> -U <user> -d <database>
```

## Step 2: Run Diagnostics

Run ALL of these diagnostic queries and report the results:

### TOAST Table Sizes (the most common issue)
```sql
SELECT
  n.nspname AS schema_name,
  c.relname AS table_name,
  t.relname AS toast_table,
  pg_size_pretty(pg_relation_size(t.oid)) AS toast_size,
  pg_size_pretty(pg_relation_size(c.oid)) AS main_size,
  pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size
FROM pg_class c
JOIN pg_class t ON t.oid = c.reltoastrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE t.relkind = 't'
ORDER BY pg_relation_size(t.oid) DESC
LIMIT 20;
```

### Idle/Long-Running Transactions (block VACUUM from reclaiming space)
```sql
SELECT pid, state, now() - xact_start AS tx_age,
       now() - query_start AS query_age,
       left(query, 150) AS query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY xact_start ASC
LIMIT 20;
```

### Dead Tuple Counts (tables needing VACUUM)
```sql
SELECT schemaname, relname,
       n_dead_tup, n_live_tup,
       round(n_dead_tup::numeric / greatest(n_live_tup, 1) * 100, 1) AS dead_pct,
       last_vacuum, last_autovacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 10000
ORDER BY n_dead_tup DESC
LIMIT 20;
```

### VACUUM Horizon (if old, something is holding it back)
```sql
SELECT datname, datfrozenxid, age(datfrozenxid) AS xid_age
FROM pg_database WHERE datname = current_database();
```

### Overall Disk Usage
```sql
SELECT
  n.nspname AS schema_name,
  c.relname AS table_name,
  pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
  pg_size_pretty(pg_relation_size(c.oid)) AS table_size,
  pg_size_pretty(pg_indexes_size(c.oid)) AS index_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'r'
  AND n.nspname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY pg_total_relation_size(c.oid) DESC
LIMIT 20;
```

### Active Locks
```sql
SELECT l.pid, l.mode, l.granted, c.relname, a.state, left(a.query, 100) AS query
FROM pg_locks l
JOIN pg_class c ON c.oid = l.relation
JOIN pg_stat_activity a ON a.pid = l.pid
WHERE NOT l.granted OR l.mode LIKE '%Exclusive%'
ORDER BY l.granted, c.relname
LIMIT 20;
```

### Database Size
```sql
SELECT pg_size_pretty(pg_database_size(current_database())) AS db_size;
```

## Step 3: Analyze and Recommend

Based on the results, identify:

1. **Root cause**: What is causing the issue (idle transactions, TOAST bloat, missing vacuums, etc.)
2. **Immediate fix**: Commands to run right now (e.g., `pg_terminate_backend(pid)`, `VACUUM FULL`)
3. **Prevention**: What should be done to prevent recurrence

### Common Fixes

**Kill idle-in-transaction sessions:**
```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle in transaction'
  AND now() - xact_start > interval '2 minutes';
```

**VACUUM FULL a bloated table** (locks table, use with care):
```sql
VACUUM FULL VERBOSE "schema_name"."table_name";
```

**Regular VACUUM** (less disruptive, doesn't reclaim TOAST as well):
```sql
VACUUM VERBOSE "schema_name"."table_name";
```

## Important Notes

- `VACUUM FULL` takes an ACCESS EXCLUSIVE lock — all queries on that table will block until it finishes. Warn the user before running.
- Always ask the user before running destructive operations (killing sessions, VACUUM FULL).
- The mainnet processor has a built-in TOAST vacuum monitor (`src/utils/toast-vacuum.ts`) that checks every 30 minutes and auto-vacuums tables with TOAST > 1GB.
- Session timeouts are configured at the database level: `idle_in_transaction_session_timeout = 2min`, `idle_session_timeout = 5min`.
- Use `$ARGUMENTS` for any specific table or issue the user wants to investigate.
