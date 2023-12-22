import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class BalancerPool {
    constructor(props?: Partial<BalancerPool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    address!: string

    @Column_("text", {nullable: false})
    name!: string

    @Column_("int4", {nullable: false})
    tokenCount!: number

    @Column_("text", {nullable: false})
    token0!: string

    @Column_("text", {nullable: false})
    token1!: string

    @Column_("text", {nullable: true})
    token2!: string | undefined | null

    @Column_("text", {nullable: true})
    token3!: string | undefined | null
}
