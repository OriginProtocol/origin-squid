import { GraphQLResolveInfo } from 'graphql'
import { Field, Info, ObjectType, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'

import { symbols } from '@utils/symbols'

@ObjectType()
export class Symbol {
  @Field(() => String, { nullable: false })
  chainId!: number
  @Field(() => String, { nullable: false })
  address!: string
  @Field(() => String, { nullable: false })
  symbol!: string

  constructor(props: Partial<Symbol>) {
    Object.assign(this, props)
  }
}

@Resolver()
export class SymbolResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [Symbol])
  async symbols(@Info() _info: GraphQLResolveInfo): Promise<Symbol[]> {
    return symbols.map((symbol) => new Symbol(symbol))
  }
}
