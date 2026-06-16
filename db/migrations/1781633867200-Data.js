module.exports = class Data1781633867200 {
    name = 'Data1781633867200'

    async up(db) {
        // In-place upgrade of the live v155 database (continues the existing DB, no re-sync):
        // add the per-asset `outstanding_assets` array (in-flight protocol redemptions, aligned
        // to Arm.assets) and backfill it from existing data. Adding a NOT NULL column to a
        // populated table requires a temporary default; we backfill, then drop the default so the
        // schema matches main's squashed migration (where the column is created NOT NULL, no default).
        await db.query(`ALTER TABLE "arm_state" ADD COLUMN "outstanding_assets" text array NOT NULL DEFAULT '{}'`)
        await db.query(`ALTER TABLE "arm_daily_stat" ADD COLUMN "outstanding_assets" text array NOT NULL DEFAULT '{}'`)
        // Every ARM is still pre-upgrade (single base asset, upgradeBlock=null), so
        // outstanding_assets = [0, outstandingAssets1]: [0] = liquidity asset (never redeems into
        // itself), [1] = the existing outstanding_assets1 scalar. outstanding_assets1 is a numeric
        // BigInt; cast to plain-integer text to match the entity's decimal-string array format.
        await db.query(`UPDATE "arm_state" SET "outstanding_assets" = ARRAY['0', "outstanding_assets1"::text]`)
        await db.query(`UPDATE "arm_daily_stat" SET "outstanding_assets" = ARRAY['0', "outstanding_assets1"::text]`)
        await db.query(`ALTER TABLE "arm_state" ALTER COLUMN "outstanding_assets" DROP DEFAULT`)
        await db.query(`ALTER TABLE "arm_daily_stat" ALTER COLUMN "outstanding_assets" DROP DEFAULT`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "arm_state" DROP COLUMN "outstanding_assets"`)
        await db.query(`ALTER TABLE "arm_daily_stat" DROP COLUMN "outstanding_assets"`)
    }
}
