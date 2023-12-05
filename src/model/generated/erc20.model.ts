import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class ERC20 {
    constructor(props?: Partial<ERC20>) {
        Object.assign(this, props)
    }

    /**
     * Format: 'address'
     */
    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    address!: string

    @Column_("text", {nullable: false})
    name!: string

    @Column_("int4", {nullable: false})
    decimals!: number

    @Column_("text", {nullable: false})
    symbol!: string
}
