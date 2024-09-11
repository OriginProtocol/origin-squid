import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {OTokenAPY} from "./oTokenApy.model"

@Entity_()
export class OTokenRebase {
    constructor(props?: Partial<OTokenRebase>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    otoken!: string

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @StringColumn_({nullable: false})
    txHash!: string

    @BigIntColumn_({nullable: false})
    totalSupply!: bigint

    @BigIntColumn_({nullable: false})
    rebasingCredits!: bigint

    @BigIntColumn_({nullable: false})
    rebasingCreditsPerToken!: bigint

    @Index_()
    @ManyToOne_(() => OTokenAPY, {nullable: true})
    apy!: OTokenAPY

    @BigIntColumn_({nullable: false})
    fee!: bigint

    @BigIntColumn_({nullable: false})
    feeETH!: bigint

    @BigIntColumn_({nullable: false})
    feeUSD!: bigint

    @BigIntColumn_({nullable: false})
    yield!: bigint

    @BigIntColumn_({nullable: false})
    yieldETH!: bigint

    @BigIntColumn_({nullable: false})
    yieldUSD!: bigint
}
