import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {OTokenAddress} from "./oTokenAddress.model"
import {RebasingOption} from "./_rebasingOption"

@Entity_()
export class OTokenRebaseOption {
    constructor(props?: Partial<OTokenRebaseOption>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    chainId!: number

    @Index_()
    @Column_("text", {nullable: false})
    otoken!: string

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
    @ManyToOne_(() => OTokenAddress, {nullable: true})
    address!: OTokenAddress

    @Column_("varchar", {length: 6, nullable: false})
    status!: RebasingOption
}
