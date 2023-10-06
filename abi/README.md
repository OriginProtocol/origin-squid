# ABI folder

This is a dedicated folder for ABI files. Place you contract ABI here and generate facade classes for type-safe decoding
of the event, function data and contract state queries with

```sh
sqd typegen
```

This `typegen` command is defined in `commands.json`.

## Note:

Use lowercase filenames to avoid problems with generated code.

```
Vyper_contract > vyper-contract
OETHVault > oeth-vault
OETH > oeth
BaseRewardPool > base-reward-pool
```