module.exports = class Data1698085073897 {
    name = 'Data1698085073897'

    async up(db) {
        await db.query(`ALTER TABLE "oeth_balancer_meta_pool_strategy" DROP COLUMN "total"`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "oeth_balancer_meta_pool_strategy" ADD "total" numeric NOT NULL`)
    }
}
