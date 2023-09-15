import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {Address} from "./address.model"

@Entity_()
export class RebaseOption {
    constructor(props?: Partial<RebaseOption>) {
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
    txHash!: string

    @Index_()
    @ManyToOne_(() => Address, {nullable: true})
    address!: Address

    @Column_("text", {nullable: false})
    status!: string
}
