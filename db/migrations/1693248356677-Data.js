module.exports = class Data1693248356677 {
    name = 'Data1693248356677'

    async up(db) {
        await db.query(`CREATE TABLE "history" ("id" character varying NOT NULL, "value" numeric NOT NULL, "balance" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "tx_hash" text NOT NULL, "type" text NOT NULL, "address_id" character varying, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_59a55adcc59ddb69c297da693e" ON "history" ("address_id") `)
        await db.query(`CREATE INDEX "IDX_7a259431108a22e8ca2f375fc7" ON "history" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_1b82c15d87635d95eaa4dd42ec" ON "history" ("tx_hash") `)
        await db.query(`CREATE TABLE "address" ("id" character varying NOT NULL, "is_contract" boolean NOT NULL, "rebasing_option" text NOT NULL, "balance" numeric NOT NULL, "earned" numeric NOT NULL, "credits" numeric NOT NULL, "last_updated" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_59a55adcc59ddb69c297da693e5" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "history"`)
        await db.query(`DROP INDEX "public"."IDX_59a55adcc59ddb69c297da693e"`)
        await db.query(`DROP INDEX "public"."IDX_7a259431108a22e8ca2f375fc7"`)
        await db.query(`DROP INDEX "public"."IDX_1b82c15d87635d95eaa4dd42ec"`)
        await db.query(`DROP TABLE "address"`)
        await db.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_59a55adcc59ddb69c297da693e5"`)
    }
}
