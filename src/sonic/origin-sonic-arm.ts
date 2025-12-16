import { createOriginARMProcessors } from '@templates/origin-arm'
import { sonicAddresses } from '@utils/addresses-sonic'

export const sonicArmProcessors = createOriginARMProcessors({
  name: 'origin-os-arm',
  from: 28716127,
  armAddress: sonicAddresses.armOS.address,
  token0: 'wS',
  token1: 'OS',
  capManagerAddress: sonicAddresses.armOS.capManager,
  marketFrom: 37481525,
  armType: 'os',
})
