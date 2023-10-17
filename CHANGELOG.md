# Changelog

## v8

- Data requirements analysis
- Ability to handle multiple squid processors:
    - [main.ts](src%2Fmain.ts)
    - [processor.ts](src%2Fprocessor.ts)
- `curve` processor & template
    - processing by day historically and then realtime thereafter
- schema spread out into multiple `graphql` files and built via `yarn codegen`
- created otoken processor to handle OUSD and OETH contract processing
- `ousd` processing added, however the data has not yet been validated
    - We're unable to process as far back as we want to due to an archive server bug. (reported to them)

## v7

- APY numbers have been changed to return proper percentages. (v6 value / 100) **BREAKING**
- Added `ExchangeRate` entities.