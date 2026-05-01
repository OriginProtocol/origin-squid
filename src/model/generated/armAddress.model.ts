import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {ArmHistory} from "./armHistory.model"

@Entity_()
export class ArmAddress {
    constructor(props?: Partial<ArmAddress>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    arm!: string

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @BooleanColumn_({nullable: false})
    isContract!: boolean

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @BigIntColumn_({nullable: false})
    deposited!: bigint

    @BigIntColumn_({nullable: false})
    withdrawn!: bigint

    @BigIntColumn_({nullable: false})
    earned!: bigint

    @FloatColumn_({nullable: false})
    roi!: number

    @IntColumn_({nullable: false})
    blockNumber!: number

    @DateTimeColumn_({nullable: false})
    lastUpdated!: Date

    @DateTimeColumn_({nullable: true})
    since!: Date | undefined | null

    @OneToMany_(() => ArmHistory, e => e.address)
    history!: ArmHistory[]
}
