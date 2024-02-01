import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {LRTDepositorPointData} from "./lrtDepositorPointData.model"

@Entity_()
export class LRTDepositor {
    constructor(props?: Partial<LRTDepositor>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => LRTDepositorPointData, e => e.depositor)
    pointData!: LRTDepositorPointData[]
}
