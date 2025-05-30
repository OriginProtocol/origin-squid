import { createOriginARMProcessors } from '@templates/origin-arm'
import { addresses } from '@utils/addresses'

export const originArmProcessors = createOriginARMProcessors({
  name: 'origin-arm',
  from: 20987226,
  armAddress: addresses.arm.address,
  capManagerAddress: addresses.arm.capManager,
  lidoArm: true,
})
