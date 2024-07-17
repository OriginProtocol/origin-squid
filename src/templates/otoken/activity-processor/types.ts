import { Block, Context, Log } from '@processor'
import { Activity } from '@templates/otoken/activity-types'
import { LogFilter } from '@utils/logFilter'

export interface ActivityProcessor<T extends Activity = Activity> {
  name: string
  filters: LogFilter[]
  process: (ctx: Context, block: Block, logs: Log[]) => Promise<T[]>
}
