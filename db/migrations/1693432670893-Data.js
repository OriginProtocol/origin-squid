module.exports = class Data1693432670893 {
    name = 'Data1693432670893'

    async up(db) {
        await db.query(`CREATE TABLE "history" ("id" character varying NOT NULL, "value" numeric NOT NULL, "balance" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "tx_hash" text NOT NULL, "type" text NOT NULL, "address_id" character varying, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_59a55adcc59ddb69c297da693e" ON "history" ("address_id") `)
        await db.query(`CREATE INDEX "IDX_7a259431108a22e8ca2f375fc7" ON "history" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_1b82c15d87635d95eaa4dd42ec" ON "history" ("tx_hash") `)
        await db.query(`CREATE TABLE "address" ("id" character varying NOT NULL, "is_contract" boolean NOT NULL, "rebasing_option" text NOT NULL, "balance" numeric NOT NULL, "earned" numeric NOT NULL, "credits" numeric NOT NULL, "last_updated" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "apy" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "tx_hash" text NOT NULL, "apr" numeric NOT NULL, "apy" numeric NOT NULL, "apy7_day_avg" numeric NOT NULL, "apy14_day_avg" numeric NOT NULL, "apy30_day_avg" numeric NOT NULL, "rebasing_credits_per_token" numeric NOT NULL, CONSTRAINT "PK_7826924ff9c029af7533753f6af" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_1f069a908b679be0b5fbc0b2e6" ON "apy" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_7fb752652a983d6629a722ae7a" ON "apy" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_d1165411d71160d1230073d0fa" ON "apy" ("tx_hash") `)
        await db.query(`CREATE TABLE "rebase" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "tx_hash" text NOT NULL, "total_supply" numeric NOT NULL, "rebasing_credits" numeric NOT NULL, "rebasing_credits_per_token" numeric NOT NULL, "apy_id" character varying, CONSTRAINT "PK_cadd381a400a7e41b538c788d13" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_c308a9ecd3d05b0c45e7c60d10" ON "rebase" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_a5955dbd9ac031314697cbd54f" ON "rebase" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_7cd793b6c4bc15b9082e0eb97a" ON "rebase" ("tx_hash") `)
        await db.query(`CREATE INDEX "IDX_02d02f9022ef86e60f1a84b9dc" ON "rebase" ("apy_id") `)
        await db.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_59a55adcc59ddb69c297da693e5" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "rebase" ADD CONSTRAINT "FK_02d02f9022ef86e60f1a84b9dc2" FOREIGN KEY ("apy_id") REFERENCES "apy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "history"`)
        await db.query(`DROP INDEX "public"."IDX_59a55adcc59ddb69c297da693e"`)
        await db.query(`DROP INDEX "public"."IDX_7a259431108a22e8ca2f375fc7"`)
        await db.query(`DROP INDEX "public"."IDX_1b82c15d87635d95eaa4dd42ec"`)
        await db.query(`DROP TABLE "address"`)
        await db.query(`DROP TABLE "apy"`)
        await db.query(`DROP INDEX "public"."IDX_1f069a908b679be0b5fbc0b2e6"`)
        await db.query(`DROP INDEX "public"."IDX_7fb752652a983d6629a722ae7a"`)
        await db.query(`DROP INDEX "public"."IDX_d1165411d71160d1230073d0fa"`)
        await db.query(`DROP TABLE "rebase"`)
        await db.query(`DROP INDEX "public"."IDX_c308a9ecd3d05b0c45e7c60d10"`)
        await db.query(`DROP INDEX "public"."IDX_a5955dbd9ac031314697cbd54f"`)
        await db.query(`DROP INDEX "public"."IDX_7cd793b6c4bc15b9082e0eb97a"`)
        await db.query(`DROP INDEX "public"."IDX_02d02f9022ef86e60f1a84b9dc"`)
        await db.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_59a55adcc59ddb69c297da693e5"`)
        await db.query(`ALTER TABLE "rebase" DROP CONSTRAINT "FK_02d02f9022ef86e60f1a84b9dc2"`)
    }
}
