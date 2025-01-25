import assert from 'assert'
import { detailedDiff } from 'deep-object-diff'
import { pick } from 'lodash'

import { jsonify } from '@originprotocol/squid-utils'

export const compare = (expectation: any, actual: any) => {
  // We decide to only care about float decimal accuracy to the 8th.
  expectation = JSON.parse(
    jsonify(pick(expectation, Object.keys(expectation)), (_key, value) =>
      typeof value === 'number' ? Number(value.toFixed(8)) : value,
    ),
  )
  actual = JSON.parse(
    jsonify(pick(actual, Object.keys(expectation)), (_key, value) =>
      typeof value === 'number' ? Number(value.toFixed(8)) : value,
    ),
  )
  const diff = detailedDiff(expectation, actual)
  try {
    assert(Object.keys(diff.updated).length === 0 && Object.keys(diff.deleted).length === 0)
  } catch (err) {
    console.log('Validation failed for:', expectation.id)
    console.log('actual', JSON.stringify(actual, null, 2))
    console.log('expectation', JSON.stringify(expectation, null, 2))
    console.log('diff', JSON.stringify(diff, null, 2))
    if (process.env.IGNORE_VALIDATION !== 'true') {
      throw new Error('Expected and actual values do not match')
    }
  }
}
