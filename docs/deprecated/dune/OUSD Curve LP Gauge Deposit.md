# OUSD Curve LP Gauge Deposit

https://dune.xyz/embeds/278734/528075/c2b8b10f-9a32-495b-a5e1-bccbae2a860a
https://dune.com/queries/285485/539422

```sql
WITH transfers AS (
    SELECT evt_block_number as block_number,
    address,
    amount
    FROM
    ( 
        SELECT evt_block_number,
            "to" AS address,
            value AS amount
        FROM ousd."OusdImplementation_evt_Transfer"
        WHERE evt_block_number > 11596940 -- OUSD V2 block number
        
        UNION ALL 
        
        SELECT evt_block_number,
            "from" AS address,
            -value AS amount
        FROM ousd."OusdImplementation_evt_Transfer"
        WHERE evt_block_number > 11596940 -- OUSD V2 block number
    ) t
),

curve_lp_transfers AS (
    SELECT evt_block_time,
    "to" AS address,
    ROUND(value / 1e18) as amount
    FROM erc20."ERC20_evt_Transfer" tr
    WHERE contract_address='\x25f0cE4E2F8dbA112D9b115710AC297F816087CD'
    AND "to" != '\x0000000000000000000000000000000000000000'
    
    UNION ALL 
    
    SELECT evt_block_time,
    "from" AS address,
    ROUND(-value / 1e18) as amount
    FROM erc20."ERC20_evt_Transfer" tr
    WHERE contract_address='\x25f0cE4E2F8dbA112D9b115710AC297F816087CD'
    AND "from" != '\x0000000000000000000000000000000000000000'
),

day_hops_3 AS (
    SELECT date_trunc('day', day) as day
    FROM(
        SELECT generate_series('2021-11-15'::date, 'now'::timestamp - '1 week'::interval, '3 day') AS day
        UNION ALL 
        SELECT generate_series('now'::timestamp - '6 days'::interval, date_trunc('day', NOW()), '1 day') AS day
    ) DAYS
    ORDER BY day desc
),

token_balances as (
    SELECT d.day,
    t.address as wallet_address,
    SUM(amount) as balance
    FROM curve_lp_transfers t
    INNER JOIN day_hops_3 d
    ON t.evt_block_time < d.day
    GROUP BY 1, 2
    ORDER BY 1 desc
)


select day,
ROUND(sum(balance) filter (WHERE wallet_address = '\x989aeb4d175e16225e39e87d0d97a3360524ad80')) AS "Convex",
ROUND(sum(balance) filter (WHERE wallet_address != '\x989aeb4d175e16225e39e87d0d97a3360524ad80')) AS "Other",
ROUND(sum(balance)) as amount,
count(distinct wallet_address) as holders
FROM token_balances
GROUP BY 1;
```