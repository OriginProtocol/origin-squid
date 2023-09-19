import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import {Vault} from "./vault.model"
import {CurveLP} from "./curveLp.model"
import {FraxStaking} from "./fraxStaking.model"
import {MorphoAave} from "./morphoAave.model"
import {Dripper} from "./dripper.model"

@Entity_()
export class FinancialStatement {
    constructor(props?: Partial<FinancialStatement>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @ManyToOne_(() => Vault, {nullable: true})
    vault!: Vault

    @Index_()
    @ManyToOne_(() => CurveLP, {nullable: true})
    curveLP!: CurveLP

    @Index_()
    @ManyToOne_(() => FraxStaking, {nullable: true})
    fraxStaking!: FraxStaking

    @Index_()
    @ManyToOne_(() => MorphoAave, {nullable: true})
    morphoAave!: MorphoAave

    @Index_()
    @ManyToOne_(() => Dripper, {nullable: true})
    dripper!: Dripper
}
