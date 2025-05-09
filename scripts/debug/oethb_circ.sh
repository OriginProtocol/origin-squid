#!/bin/bash

RPC_URL=
BLOCK=29979726
TOKEN="0xdbfefd2e8460a6ee4955a68582f85708baea60a3"
CURVE_POOL="0x302a94e3c28c290eaf2a4605fc52e11eb915f378"
CURVE_GAUGE="0x9da8420dbeebdfc4902b356017610259ef7eedd8"
CURVE_STRATEGY="0x9cfcAF81600155e01c63e4D2993A8A81A8205829"
AERO_FACTORY="0x68c19e13618c41158fe4baba1b8fb3a9c74bdb0a"
AERO_ARGS="10 114 0xf611cc500eee7e4e4763a05fe623e2363c86d2af 0x5e7bb104d84c7cb9b682aac2f3d509f5f406809a"
STRATEGY="0x80c864704dd06c3693ed5179190786ee38acf835"
WETH="0x4200000000000000000000000000000000000006"

# 1. Call contract methods
total_supply=$(cast call $TOKEN "totalSupply()(uint256)" -b $BLOCK -r $RPC_URL --json | jq -r '.[0]')
curve_pool=$(cast call $TOKEN "balanceOf(address)(uint256)" $CURVE_POOL -b $BLOCK -r $RPC_URL --json | jq -r '.[0]')
curve_pool_supply=$(cast call $CURVE_POOL "totalSupply()(uint256)" -b $BLOCK -r $RPC_URL --json | jq -r '.[0]')
curve_gauge_supply=$(cast call $CURVE_GAUGE "totalSupply()(uint256)" -b $BLOCK -r $RPC_URL --json | jq -r '.[0]')
curve_gauge_amo=$(cast call $CURVE_GAUGE "balanceOf(address)(uint256)" $CURVE_STRATEGY -b $BLOCK -r $RPC_URL --json | jq -r '.[0]')
aero_data=$(cast call $AERO_FACTORY "positionsByFactory(uint256,uint256,address,address)" $AERO_ARGS -b $BLOCK -r $RPC_URL)
woeth_bal=$(cast call $STRATEGY "checkBalance(address)(uint256)" $WETH -b $BLOCK -r $RPC_URL --json | jq -r '.[0]')

# 2. Extract staked1 (index 9) from aero_data
staked1_hex=$(echo "$aero_data" | cut -c579-642)
aero_amo=$(echo "$staked1_hex" | cast --to-dec)


# 3. Math with bc
curve_ownership=$(echo "($curve_gauge_supply * 1e18 / $curve_pool_supply) * ($curve_gauge_amo * 1e18 / $curve_gauge_supply) / 1e18" | bc)
curve_amo=$(echo "$curve_pool * $curve_ownership / 1e18" | bc)
sum_amo=$(echo "$curve_amo + $aero_amo" | bc)
non_amo=$(echo "$total_supply - $sum_amo" | bc)
adjusted=$(echo "$non_amo - $woeth_bal" | bc)

# 4. Output
echo
echo "=== Balances at block $BLOCK ==="
echo "Curve Pool:          $curve_pool"
echo "Curve AMO ownership: $curve_ownership"
echo "Curve AMO:           $curve_amo"
echo "Aerodrome AMO:       $aero_amo"
echo "Sum AMO:             $sum_amo"
echo
echo "Strategy WETH Bal:   $woeth_bal"
echo
echo "Total Supply:        $total_supply"
echo
echo "Circulating Supply:  $non_amo"
echo "  (Total - AMO)      "
echo "- WOETH Strat WETH:  $adjusted"
echo