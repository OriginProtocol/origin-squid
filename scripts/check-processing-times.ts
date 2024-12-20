import fs from 'fs'

const LIMIT = 1000

const gql = (query: string) => query

const executeQuery = async <T>(query: string): Promise<T> => {
  const response = await fetch(`https://origin.squids.live/origin-squid@${process.argv[2]}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  const text = await response.text()
  if (response.status !== 200) {
    throw new Error(`Failed to execute query: ${text}`)
  }
  try {
    return JSON.parse(text)
  } catch (err) {
    console.log(text)
    throw err
  }
}

const main = async () => {
  const result = await executeQuery<{
    data: {
      processingStatuses: {
        id: string
        startTimestamp: string
        headTimestamp: string
        blockNumber: string
        timestamp: string
      }[]
    }
  }>(
    gql(`
    query MyQuery {
      processingStatuses(limit: 10, orderBy: id_ASC) {
        id
        startTimestamp
        headTimestamp
        blockNumber
        timestamp
      }
    }
  `),
  )

  let output = `Processing Times\n`
  output += '==============================\n'
  output += `Version: ${process.argv[2]}\nDate: ${new Date().toISOString()}\n`
  output += '==============================\n'
  for (const status of result.data.processingStatuses) {
    const minutes = (Date.parse(status.headTimestamp) - Date.parse(status.startTimestamp)) / (1000 * 60)
    output += `${status.id}: ${minutes.toFixed(2)} minutes\n`
  }
  console.log(output)
  fs.writeFileSync(`processing-times.log`, output)
}

main()
