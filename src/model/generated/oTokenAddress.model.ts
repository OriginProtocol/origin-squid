import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {RebasingOption} from "./_rebasingOption"
import {OTokenHistory} from "./oTokenHistory.model"

@Entity_()
export class OTokenAddress {
    constructor(props?: Partial<OTokenAddress>) {
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
    @StringColumn_({nullable: false})
    address!: string

    @BooleanColumn_({nullable: false})
    isContract!: boolean

    @Column_("varchar", {length: 21, nullable: false})
    rebasingOption!: RebasingOption

    @BigIntColumn_({nullable: false})
    credits!: bigint

    @BigIntColumn_({nullable: false})
    creditsPerToken!: bigint

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @BigIntColumn_({nullable: false})
    earned!: bigint

    @Index_()
    @ManyToOne_(() => OTokenAddress, {nullable: true})
    yieldTo!: OTokenAddress | undefined | null

    @Index_()
    @ManyToOne_(() => OTokenAddress, {nullable: true})
    yieldFrom!: OTokenAddress | undefined | null

    @IntColumn_({nullable: false})
    blockNumber!: number

    @DateTimeColumn_({nullable: false})
    lastUpdated!: Date

    @DateTimeColumn_({nullable: true})
    since!: Date | undefined | null

    @OneToMany_(() => OTokenHistory, e => e.address)
    history!: OTokenHistory[]
}
