module.exports = class FixArmFees1771628425598 {
    async up(db) {
        await db.query(`
            WITH corrected AS (
                SELECT
                    ads.id,
                    ads.chain_id,
                    ads.address,
                    ads.date,
                    (s.total_fees + s.fees_accrued) as new_cumulative_fees
                FROM arm_daily_stat ads
                JOIN arm_state s
                    ON s.chain_id = ads.chain_id
                    AND s.address = ads.address
                    AND s.block_number = ads.block_number
            ),
            with_lag AS (
                SELECT
                    id,
                    new_cumulative_fees,
                    new_cumulative_fees - COALESCE(
                        LAG(new_cumulative_fees) OVER (
                            PARTITION BY chain_id, address
                            ORDER BY date
                        ),
                        0
                    ) as new_fees
                FROM corrected
            )
            UPDATE arm_daily_stat ads
            SET
                cumulative_fees = wl.new_cumulative_fees,
                fees = wl.new_fees
            FROM with_lag wl
            WHERE ads.id = wl.id
        `)
    }

    async down(db) {
        // Revert to using only totalFees (collected fees)
        await db.query(`
            WITH corrected AS (
                SELECT
                    ads.id,
                    ads.chain_id,
                    ads.address,
                    ads.date,
                    s.total_fees as old_cumulative_fees
                FROM arm_daily_stat ads
                JOIN arm_state s
                    ON s.chain_id = ads.chain_id
                    AND s.address = ads.address
                    AND s.block_number = ads.block_number
            ),
            with_lag AS (
                SELECT
                    id,
                    old_cumulative_fees,
                    old_cumulative_fees - COALESCE(
                        LAG(old_cumulative_fees) OVER (
                            PARTITION BY chain_id, address
                            ORDER BY date
                        ),
                        0
                    ) as old_fees
                FROM corrected
            )
            UPDATE arm_daily_stat ads
            SET
                cumulative_fees = wl.old_cumulative_fees,
                fees = wl.old_fees
            FROM with_lag wl
            WHERE ads.id = wl.id
        `)
    }
}
