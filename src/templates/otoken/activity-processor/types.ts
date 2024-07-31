import { OTokenActivity } from '@model'
import { Block, Context, Log } from '@processor'
import { LogFilter } from '@utils/logFilter'

export interface ActivityProcessor {
  name: string
  filters: LogFilter[]
  process: (ctx: Context, block: Block, logs: Log[]) => Promise<OTokenActivity[]>
}
