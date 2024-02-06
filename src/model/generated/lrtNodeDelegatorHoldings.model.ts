import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {LRTNodeDelegator} from "./lrtNodeDelegator.model"

@Entity_()
export class LRTNodeDelegatorHoldings {
    constructor(props?: Partial<LRTNodeDelegatorHoldings>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => LRTNodeDelegator, {nullable: true})
    delegator!: LRTNodeDelegator

    @Index_()
    @Column_("text", {nullable: false})
    asset!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amount!: bigint
}
