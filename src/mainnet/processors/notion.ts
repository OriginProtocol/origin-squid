import { WalletLabels } from '@model'
import { defineProcessor } from '@originprotocol/squid-utils'

let lastUpdate = 'nothing' // new Date().toJSON().slice(0, 7)

export const notionProcessor = defineProcessor({
  name: 'wallet-labels',
  from: 22200000,
  setup(p) {
    p.includeAllBlocks()
  },
  process: async (ctx) => {
    const now = new Date().toJSON().slice(0, 7)
    if (now !== lastUpdate) {
      lastUpdate = now

      ctx.log.info('updating wallet labels')

      const databaseId = '1d084d46-f53c-8016-bf33-cb9489885965'
      const result = await fetch(`https://api.originprotocol.com/notion/${databaseId}`, {
        headers: {
          Authorization: `Bearer ${process.env.NOTION_SECRET}`,
        },
      })
      const data = (await result.json()) as Database

      const results: WalletLabels[] = []

      for (const [id, entry] of Object.entries(data)) {
        const result = new WalletLabels({
          id: `${databaseId}-${id}`,
          address: entry.properties.Address.title[0]?.plain_text.toLowerCase() ?? '',
          description: entry.properties.Description.rich_text[0]?.plain_text ?? '',
          labels: entry.properties.Labels.multi_select.map((label) => label.name),
          lastUpdated: new Date(entry.last_edited_time),
        })
        results.push(result)
      }

      await ctx.store.save(results)
    }
  },
})

type Database = Record<string, DatabaseEntry>
interface DatabaseEntry {
  id: string
  last_edited_time: string
  properties: {
    Labels: {
      id: string
      type: 'multi_select'
      multi_select: { id: string; name: string; color: string }[]
    }
    Description: {
      id: string
      type: 'rich_text'
      rich_text: {
        type: 'text'
        text: { content: string; link: null }
        plain_text: string
        href: null
      }[]
    }
    'Date Added': { id: string; type: 'created_time'; created_time: string }
    Address: {
      id: string
      type: 'title'
      title: {
        type: 'text'
        text: { content: string; link: null }
        plain_text: string
        href: null
      }[]
    }
    Status: {
      id: string
      type: 'select'
      select: { id: string; name: string; color: string }
    }
  }
}
