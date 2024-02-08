import { isAddress } from 'viem'

import { decodeAddress, encodeAddress } from './encoding'

interface ReferrerData {
  referralId: string
  address: string
  referrerMultiplier: bigint
}

export const defaultReferrerData = (referralId: string, address: string) => ({
  referralId,
  address,
  referrerMultiplier: 10n,
})

export const referrerList: ReferrerData[] = [
  // Tests
  // {
  //   referralId: 'Origin',
  //   address: '0xF92aaa76e61af8dD5E1eFC888EACEb229d4a6795'.toLowerCase(),
  //   referrerMultiplier: 20n,
  // },

  // Official
  {
    referralId: 'alexwacy',
    address: '0x769c1c6754308B71b9080476dC5bE43Fc07805fc',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'gideon',
    address: '0xCc263863362fe3d31784cb467111dE8eD9C95FB1',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'xeus',
    address: '0x6bccf642b6bcb4e0c8ac490ead141dedd03a4c4f',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'potens',
    address: '0x5a6DB0FF376b539d0dc1202c20Ab3efDAc81482d',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'hermes',
    address: '0x9E4C537E9bAc8799E5dc2355219f21338f4801eA',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'michael',
    address: '0x15e243363d02b57d1e8ad83ad1898f9eea8929f4',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'davidgmi',
    address: '0xCE381A18BcE0A27e6a5DBCef8b7f58b425bc9d93',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'tanaka',
    address: '0x313e2223436e151C6B4167c63a5e0324aC8FbcED',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'salazar',
    address: '0xe6a036ca5ac86aff806f255c38789fd7f0297ece',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'cryptonova',
    address: '0xb338B3177B1668eb4c921c5971853712Ae1F7219',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'resdegen',
    address: '0xf8d1AE33b2454548939f8C8B08a2f07fD0535805',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'brill',
    address: '0xb5a35e549d114923a7c60cdc70ce9fd4e1048c17',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'marsdefi',
    address: '0x0Eb904f5d2CBA4FD6425097E091Bd5dd109C87fD',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'viktordefi',
    address: '0xDcf8c3e582198a20559a5952145680510209b9b8',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'arndxt',
    address: '0xce76ebf1c9fb4a4bde0b4256c3814ca5cb938914',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'bmsbonus',
    address: '0x156B1156833aBEA5c5779ee8FD88edc21CADcf23',
    referrerMultiplier: 20n,
  },
  {
    referralId: 'stacymuur',
    address: '0xaA9543F2eFF0e7A4b267F839612945841172B02F',
    referrerMultiplier: 20n,
  },
].map((o) => ({ ...o, address: o.address.toLowerCase() }))

export const getReferralDataForRecipient = (recipient: string) => {
  return referrerList.filter((r) => r.address === recipient)
}

export const getReferralDataForReferralCodes = (referralId: string) => {
  const entry = referrerList.find((r) => r.referralId === referralId)
  if (entry) return entry
  if (isAddress(referralId))
    return defaultReferrerData(referralId, referralId.toLowerCase())
  try {
    const decodedAddress = decodeAddress(referralId)
    if (isAddress(decodedAddress))
      return defaultReferrerData(referralId, decodedAddress.toLowerCase())
  } catch (err) {
    return undefined
  }
}

export const isValidReferralId = (referralId: string) => {
  return !!getReferralDataForReferralCodes(referralId)
}

export const isReferralSelfReferencing = (
  referralId: string,
  recipient: string,
) => {
  const data = getReferralDataForReferralCodes(referralId)
  if (!data) return false
  return data.address.toLowerCase() === recipient
}
