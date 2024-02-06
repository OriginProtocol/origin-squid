import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {LRTNodeDelegatorHoldings} from "./lrtNodeDelegatorHoldings.model"

@Entity_()
export class LRTNodeDelegator {
    constructor(props?: Partial<LRTNodeDelegator>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("text", {nullable: false})
    node!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    points!: bigint

    @OneToMany_(() => LRTNodeDelegatorHoldings, e => e.delegator)
    holdings!: LRTNodeDelegatorHoldings[]
}
