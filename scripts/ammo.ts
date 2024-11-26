const calculateFloorPriceRatio = (params: { tickWidth: number; power: number; ammoPerTick: number }) => {
  let totalEth = 50
  let totalAmmo = 50
  let tickWidth = params.tickWidth
  let ammoSale = params.ammoPerTick
  let floorPriceRatio = 0
  // console.log('price\tammo\teth\tammo\t\tassetRatio\tfloorPriceRatio')
  for (let price = params.tickWidth; price <= 100; price += tickWidth) {
    const ammo = ammoSale * Math.pow(price, params.power)
    totalEth += price * ammo
    totalAmmo += ammo

    const assetRatio = totalEth / totalAmmo
    floorPriceRatio = assetRatio / price
    // console.log(
    //   `${price.toFixed(1)}\t${assetRatio.toFixed(1)}\t${totalEth.toFixed(0)}\t${totalAmmo.toFixed(
    //     0,
    //   )}\t${floorPriceRatio.toFixed(3)}`,
    // )
  }
  console.log(`${totalEth.toFixed(0)}\t${totalAmmo.toFixed(0)}\t${floorPriceRatio.toFixed(3)}`)
  return floorPriceRatio
}

const findFloorPriceRatio = (params: { floorPriceRatioTarget: number; tickWidth: number; ammoPerTick: number }) => {
  let power = 0
  while (power < 10) {
    const floorPriceRatio = calculateFloorPriceRatio({
      tickWidth: params.tickWidth,
      power,
      ammoPerTick: params.ammoPerTick,
    })
    if (Math.abs(floorPriceRatio - params.floorPriceRatioTarget) < 0.001) {
      console.log(power)
      break
    }
    power += 0.01
  }
  return power
}

findFloorPriceRatio({ floorPriceRatioTarget: 0.7, tickWidth: 0.1, ammoPerTick: 0.1 })
