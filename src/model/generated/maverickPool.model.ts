import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class MaverickPool {
    constructor(props?: Partial<MaverickPool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    address!: string

    @Column_("text", {nullable: false})
    name!: string

    @Column_("text", {nullable: false})
    tokenA!: string

    @Column_("text", {nullable: false})
    tokenB!: string
}
