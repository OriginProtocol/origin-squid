import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class ERC20Holder {
    constructor(props?: Partial<ERC20Holder>) {
        Object.assign(this, props)
    }

    /**
     * Format: 'address:account'
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    chainId!: number

    @Column_("text", {nullable: false})
    address!: string

    @Column_("text", {nullable: false})
    account!: string
}
