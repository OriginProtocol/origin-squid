import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {OUSDAddress} from "./ousdAddress.model"
import {OUSDRebasingOption} from "./_ousdRebasingOption"

/**
 * The RebaseOption entity tracks historical rebase option changes by address.
 */
@Entity_()
export class OUSDRebaseOption {
    constructor(props?: Partial<OUSDRebaseOption>) {
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
    @ManyToOne_(() => OUSDAddress, {nullable: true})
    address!: OUSDAddress

    @Column_("varchar", {length: 6, nullable: false})
    status!: OUSDRebasingOption
}
