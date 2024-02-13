The contents of this folder exist to help validate point calculation difference between `v4` and `v5`.

1. Extra validation on the points is a good thing for confidence.
2. We don't want any regressions at this point.
3. Fix any issues found.

Executing: `ts-node scripts/validation/2024-02-11/compare.ts`

Dataset queries:

```graphql
query MyQuery {
  lrtSummaries(limit: 1, orderBy: id_DESC) {
    id
    elPoints
    points
    timestamp
  }
  lrtPointRecipients(orderBy: id_ASC) {
    id
    balance
    elPoints
    points
    pointsDate
  }
}
```

