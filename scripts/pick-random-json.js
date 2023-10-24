const data = require('./source.json')

const results = []

while (results.length < 5) {
  results.push(
    ...data.data.oethHistories
      .filter((d) => d.type === 'Received' && Math.random() < 0.001)
      .slice(0, 5 - results.length),
  )
}
while (results.length < 10) {
  results.push(
    ...data.data.oethHistories
      .filter((d) => d.type === 'Sent' && Math.random() < 0.001)
      .slice(0, 10 - results.length),
  )
}
while (results.length < 15) {
  results.push(
    ...data.data.oethHistories
      .filter((d) => d.type === 'Swap' && Math.random() < 0.001)
      .slice(0, 15 - results.length),
  )
}
while (results.length < 20) {
  results.push(
    ...data.data.oethHistories
      .filter((d) => d.type === 'Yield' && Math.random() < 0.001)
      .slice(0, 20 - results.length),
  )
}

console.log(JSON.stringify(results, null, 2))
