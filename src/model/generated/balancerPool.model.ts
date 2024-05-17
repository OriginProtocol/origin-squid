import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class BalancerPool {
    constructor(props?: Partial<BalancerPool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @StringColumn_({nullable: false})
    name!: string

    @IntColumn_({nullable: false})
    tokenCount!: number

    @StringColumn_({nullable: false})
    token0!: string

    @StringColumn_({nullable: false})
    token1!: string

    @StringColumn_({nullable: true})
    token2!: string | undefined | null

    @StringColumn_({nullable: true})
    token3!: string | undefined | null
}
