import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AeroCLPoolIncreaseObservationCardinalityNext {
    constructor(props?: Partial<AeroCLPoolIncreaseObservationCardinalityNext>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    chainId!: number

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: false})
    address!: string

    @IntColumn_({nullable: false})
    observationCardinalityNextOld!: number

    @IntColumn_({nullable: false})
    observationCardinalityNextNew!: number
}