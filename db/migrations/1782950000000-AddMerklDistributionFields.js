module.exports = class AddMerklDistributionFields1782950000000 {
  name = 'AddMerklDistributionFields1782950000000'

  // Adds the Merkl distribution-strategy fields to the live merkl_campaign table (the running
  // v158 DB predates them), then backfills the one existing ARM campaign. Its row was captured
  // before these fields existed, so without the backfill it would keep using the uncapped max
  // budget instead of the MAX_APR (2%) cap. New campaigns capture these at resolve time.
  async up(db) {
    await db.query(`ALTER TABLE "merkl_campaign" ADD "distribution_method" text`)
    await db.query(`ALTER TABLE "merkl_campaign" ADD "apr_cap" numeric`)
    await db.query(
      `UPDATE "merkl_campaign" SET "distribution_method" = 'MAX_APR', "apr_cap" = 0.02 ` +
        `WHERE "campaign_id" = '0x459f4891c0a39a940a938e81122017aa8d7509abf73cddef3b5fb7c14bb3124c'`,
    )
  }

  async down(db) {
    await db.query(`ALTER TABLE "merkl_campaign" DROP COLUMN "apr_cap"`)
    await db.query(`ALTER TABLE "merkl_campaign" DROP COLUMN "distribution_method"`)
  }
}
