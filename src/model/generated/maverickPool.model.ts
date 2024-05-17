import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class MaverickPool {
    constructor(props?: Partial<MaverickPool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @StringColumn_({nullable: false})
    name!: string

    @StringColumn_({nullable: false})
    tokenA!: string

    @StringColumn_({nullable: false})
    tokenB!: string
}
