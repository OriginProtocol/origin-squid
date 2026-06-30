module.exports = class RemoveMerklTestData1782900000000 {
  name = 'RemoveMerklTestData1782900000000'

  // One-off data cleanup for v158.
  //
  // A test Merkl campaign (creator 0x074105…, campaignId 0xcc3bb1…, targeting the
  // Ethena ARM 0xceda2d…, 2026-06-25 → 2026-06-28) was indexed before the real
  // campaign creators were configured. This removes the campaign row and resets the
  // incentive APY/yield it attributed to that ARM's daily stats. Those four days are
  // the only incentive data in the dataset, but we scope by address + date range so
  // this can't touch any real campaign data indexed later.
  async up(db) {
    // Delete the campaign first so a later recompute of those days can't re-attribute it.
    await db.query(`DELETE FROM "merkl_campaign" WHERE "creator" = '0x074105fdd39e982b2ffe749a193c942db1046ab9'`)
    await db.query(
      `UPDATE "arm_daily_stat" SET "incentive_yield" = 0, "incentive_apr" = 0, "incentive_apy" = 0 ` +
        `WHERE "address" = '0xceda2d856238aa0d12f6329de20b9115f07c366d' AND "date" BETWEEN '2026-06-25' AND '2026-06-28'`,
    )
  }

  // Irreversible cleanup — the deleted row / original values are not restorable.
  async down() {}
}
