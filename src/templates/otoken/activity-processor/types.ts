import { OTokenActivity } from '@model'
import { Block, Context, Log, LogFilter } from '@originprotocol/squid-utils'

export interface ActivityProcessor {
  name: string
  filters: LogFilter[]
  process: (ctx: Context, block: Block, logs: Log[]) => Promise<OTokenActivity[]>
}
