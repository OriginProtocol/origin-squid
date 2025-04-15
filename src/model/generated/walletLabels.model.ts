import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class WalletLabels {
    constructor(props?: Partial<WalletLabels>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    address!: string

    @StringColumn_({nullable: false})
    description!: string

    @StringColumn_({array: true, nullable: false})
    labels!: (string)[]

    @DateTimeColumn_({nullable: false})
    lastUpdated!: Date
}
