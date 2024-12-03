import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, JSONColumn as JSONColumn_} from "@subsquid/typeorm-store"

/**
 * Simple KV store to store metadata for processors.
 */
@Entity_()
export class ProcessorMetadata {
    constructor(props?: Partial<ProcessorMetadata>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @JSONColumn_({nullable: false})
    data!: unknown
}
