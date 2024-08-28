import assert from "assert"
import * as marshal from "./marshal"

export class TokenAmount {
    private _token!: string
    private _amount!: bigint

    constructor(props?: Partial<Omit<TokenAmount, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._token = marshal.string.fromJSON(json.token)
            this._amount = marshal.bigint.fromJSON(json.amount)
        }
    }

    get token(): string {
        assert(this._token != null, 'uninitialized access')
        return this._token
    }

    set token(value: string) {
        this._token = value
    }

    get amount(): bigint {
        assert(this._amount != null, 'uninitialized access')
        return this._amount
    }

    set amount(value: bigint) {
        this._amount = value
    }

    toJSON(): object {
        return {
            token: this.token,
            amount: marshal.bigint.toJSON(this.amount),
        }
    }
}
