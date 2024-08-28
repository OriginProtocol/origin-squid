import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {TokenAmount} from "./_tokenAmount"

@Entity_()
export class AeroPoolEpochState {
    constructor(props?: Partial<AeroPoolEpochState>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @Index_()
    @BigIntColumn_({nullable: false})
    epoch!: bigint

    @BigIntColumn_({nullable: false})
    votes!: bigint

    @BigIntColumn_({nullable: false})
    emissions!: bigint

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new TokenAmount(undefined, marshal.nonNull(val)))}, nullable: true})
    bribes!: (TokenAmount)[] | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new TokenAmount(undefined, marshal.nonNull(val)))}, nullable: true})
    fees!: (TokenAmount)[] | undefined | null
}
