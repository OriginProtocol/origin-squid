import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {LRTPointData} from "./lrtPointData.model"

@Entity_()
export class LRTPointRecipient {
    constructor(props?: Partial<LRTPointRecipient>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => LRTPointData, e => e.recipient)
    pointData!: LRTPointData[]
}
