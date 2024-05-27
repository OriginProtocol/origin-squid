import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"

@Entity_()
export class ESAccount {
    constructor(props?: Partial<ESAccount>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @Index_()
    @StringColumn_({nullable: false})
    account!: string

    @BigIntColumn_({nullable: false})
    assetBalance!: bigint

    @BigIntColumn_({nullable: false})
    stakedBalance!: bigint

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @BigIntColumn_({nullable: false})
    votingPower!: bigint

    @Index_()
    @ManyToOne_(() => ESAccount, {nullable: true})
    delegateTo!: ESAccount | undefined | null

    @OneToMany_(() => ESAccount, e => e.delegateTo)
    delegatesFrom!: ESAccount[]
}
