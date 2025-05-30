import { createOriginARMProcessors } from '@templates/origin-arm'
import { sonicAddresses } from '@utils/addresses-sonic'

export const sonicArmProcessors = createOriginARMProcessors({
  name: 'origin-os-arm',
  from: 28716127,
  armAddress: sonicAddresses.armOS.address,
  capManagerAddress: sonicAddresses.armOS.capManager,
  lidoArm: false,
})
