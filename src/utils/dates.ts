import dayjs from 'dayjs'

export const getDatesBetween = (startDate: string, endDate: string) => {
  const dates: string[] = []
  let currentDate = dayjs.utc(startDate)
  const end = dayjs.utc(endDate)

  while (currentDate.isBefore(end.add(1, 'day'))) {
    dates.push(currentDate.toISOString().slice(0, 10))
    currentDate = currentDate.add(1, 'day')
  }
  return dates
}

export const getDateForTimestamp = (timestamp: number) => {
  return new Date(timestamp).toISOString().slice(0, 10)
}
