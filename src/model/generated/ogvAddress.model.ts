import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class OGVAddress {
    constructor(props?: Partial<OGVAddress>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    balance!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    veogvBalance!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    votingPower!: bigint

    @Index_()
    @ManyToOne_(() => OGVAddress, {nullable: true})
    delegatee!: OGVAddress | undefined | null

    @Column_("timestamp with time zone", {nullable: false})
    lastUpdated!: Date
}
