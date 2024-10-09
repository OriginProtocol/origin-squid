import assert from 'assert'
import { detailedDiff } from 'deep-object-diff'
import { pick } from 'lodash'

import { jsonify } from '@utils/jsonify'

export const compare = (expectation: any, actual: any) => {
  // We decide to only care about float decimal accuracy to the 8th.
  expectation = JSON.parse(
    jsonify(pick(actual, Object.keys(expectation)), (_key, value) =>
      typeof value === 'number' ? Number(value.toFixed(8)) : value,
    ),
  )
  actual = JSON.parse(
    jsonify(expectation, (_key, value) => (typeof value === 'number' ? Number(value.toFixed(8)) : value)),
  )
  try {
    assert.deepEqual(expectation, actual)
  } catch (err) {
    console.log(detailedDiff(expectation, actual))
    throw new Error('Expected and actual values do not match')
  }
}
