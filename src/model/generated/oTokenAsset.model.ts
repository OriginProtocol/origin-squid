import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class OTokenAsset {
    constructor(props?: Partial<OTokenAsset>) {
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
    @Column_("text", {nullable: false})
    address!: string

    @Column_("text", {nullable: false})
    symbol!: string
}
