# Token holders - time series - breakdown by wallet number - detailed

## DEPRECATED DATASET ACCORDING TO DUNE

https://dune.com/embeds/284704/537456/a450c5db-957f-4832-8e5b-b91dd8c5db55
https://dune.com/queries/284704/537456

```sql
DROP FUNCTION IF EXISTS dune_user_generated.data2bignumber(BYTEA, INT, INT);
CREATE OR REPLACE FUNCTION dune_user_generated.data2bignumber(data BYTEA, topic INT, decimals INT) RETURNS FLOAT AS $$
BEGIN
RETURN bytea2numeric(decode(SUBSTRING(ENCODE("data",'hex'),(1+(64*"topic")),64),'hex'))/POWER(10, "decimals");
END; $$
LANGUAGE PLPGSQL;

WITH transfers AS (
    SELECT evt_block_number as block_number,
    evt_block_time as block_time,
    address,
    amount
    FROM
    ( 
        SELECT evt_block_number,
            "to" AS address,
            evt_block_time,
            value AS amount
        FROM ousd."OusdImplementation_evt_Transfer"
        WHERE evt_block_number > 11596940 -- OUSD V2 block number
        
        UNION ALL 
        
        SELECT evt_block_number,
            "from" AS address,
            evt_block_time,
            -value AS amount
        FROM ousd."OusdImplementation_evt_Transfer"
        WHERE evt_block_number > 11596940 -- OUSD V2 block number
    ) t
),

rebase_logs AS (
    -- this is kind of hackish, but for some reason "DISTINCT ON" expression is not supported
    SELECT block_number,
    MAX(block_time) as block_time,
    MAX(total_supply) as total_supply,
    MAX(rebasing_credits) as rebasing_credits,
    MIN(rebasing_credits_per_token) as rebasing_credits_per_token
    FROM(
        SELECT
        dune_user_generated.data2bignumber(data, 0, 18) as total_supply,
        dune_user_generated.data2bignumber(data, 1, 18) as rebasing_credits,
        dune_user_generated.data2bignumber(data, 2, 18) as rebasing_credits_per_token,
        *
        FROM ethereum.logs
        WHERE contract_address='\x2a8e1e676ec238d8a992307b495b45b3feaa5e86' -- OUSD
        AND topic1='\x99e56f783b536ffacf422d59183ea321dd80dcd6d23daa13023e8afea38c3df1' -- old rebase logs
        AND block_number > 11596940 -- OUSD V2 block number
        
        UNION ALL
        
        SELECT
        dune_user_generated.data2bignumber(data, 0, 18) as total_supply,
        dune_user_generated.data2bignumber(data, 1, 27) as rebasing_credits,
        dune_user_generated.data2bignumber(data, 2, 27) as rebasing_credits_per_token,
        *
        FROM ethereum.logs
        WHERE contract_address='\x2a8e1e676ec238d8a992307b495b45b3feaa5e86' -- OUSD
        AND topic1='\x41645eb819d3011b13f97696a8109d14bfcddfaca7d063ec0564d62a3e257235' -- new rebase logs
        AND block_number > 11596940 -- OUSD V2 block number
    ) DATA
    GROUP BY 1
    ORDER BY block_number DESC
),

nearest_rebase_log_to_transaction_log AS (
    SELECT t.block_number AS transaction_block_number,
    MAX(r.block_number) AS rebase_block_number
    FROM transfers AS t
    LEFT JOIN rebase_logs AS r
    ON t.block_number >= r.block_number
    GROUP BY t.block_number
),

transfer_with_credits_per_token as (
    SELECT t.*, r.rebasing_credits_per_token,
    t.amount * r.rebasing_credits_per_token as credits,
    r.block_number as rebase_block_number
    FROM transfers t INNER JOIN nearest_rebase_log_to_transaction_log nrb
    ON t.block_number = nrb.transaction_block_number
    INNER JOIN rebase_logs r
    ON r.block_number = nrb.rebase_block_number
),

-- 2 months in 3 day hops, except last 7 days that have no hops
day_hops_3 AS (
    SELECT date_trunc('day', day) as day
    FROM(
        SELECT generate_series('now'::timestamp - '2 month'::interval, 'now'::timestamp - '1 week'::interval, '3 day') AS day
        UNION ALL 
        SELECT generate_series('now'::timestamp - '6 days'::interval, date_trunc('day', NOW()), '1 day') AS day
    ) DAYS
    ORDER BY day desc
),

latest_rebases as (
    SELECT
        max_d.day as day,
        r.*
    FROM (
        SELECT d.day, MAX(r.block_time) as max_block_time
        FROM day_hops_3 d
        LEFT JOIN rebase_logs r
        ON r.block_time < d.day
        GROUP BY 1
    ) max_d INNER JOIN rebase_logs r
    ON max_d.max_block_time = r.block_time
),

token_balances as (
    SELECT
    b.day,
    wallet_address,
    credits_sum / rebasing_credits_per_token as balance
    FROM latest_rebases r
    INNER JOIN (
        SELECT d.day, t.address as wallet_address, SUM(t.credits / 1e18) as credits_sum
        FROM transfer_with_credits_per_token t
        INNER JOIN day_hops_3 d
        ON t.block_time < d.day
        WHERE t.address != '\x87650d7bbfc3a9f10587d7778206671719d9910d' -- Curve Metapool
        AND t.address != '\x129360c964e2e13910d603043f6287e5e9383374' -- Uniswap
        GROUP BY 1, 2
    ) b
    ON r.day = b.day
    ORDER BY 1 desc
)

select day,
ROUND(count(1) filter (WHERE balance > 0 AND balance < 100)) AS "0-100 OUSD",
ROUND(count(1) filter (WHERE balance > 100 AND balance < 1000)) AS "100-1k OUSD",
ROUND(count(1) filter (WHERE balance > 1000 AND balance < 3000)) AS "1k-3k OUSD",
ROUND(count(1) filter (WHERE balance > 3000 AND balance < 9000)) AS "3k-9k OUSD",
ROUND(count(1) filter (WHERE balance > 9000 AND balance < 15000)) AS "9k-15k OUSD",
ROUND(count(1) filter (WHERE balance > 15000 AND balance < 25000)) AS "15k-25k OUSD",
ROUND(count(1) filter (WHERE balance > 25000 AND balance < 40000)) AS "25k-40k OUSD",
ROUND(count(1) filter (WHERE balance > 40000 AND balance < 70000)) AS "40k-70k OUSD",
ROUND(count(1) filter (WHERE balance > 70000 AND balance < 110000)) AS "70k-110k OUSD",
ROUND(count(1) filter (WHERE balance > 110000 AND balance < 150000)) AS "110k-150k OUSD",
ROUND(count(1) filter (WHERE balance > 150000 AND balance < 250000)) AS "150k-250k OUSD",
ROUND(count(1) filter (WHERE balance > 250000 AND balance < 500000)) AS "250k-500k OUSD",
ROUND(count(1) filter (WHERE balance > 500000 AND balance < 750000)) AS "500k-750k OUSD",
ROUND(count(1) filter (WHERE balance > 750000 AND balance < 2000000)) AS "750k-2m OUSD",
ROUND(count(1) filter (WHERE balance > 2000000)) AS ">2m OUSD",
sum(balance) as amount,
count(distinct wallet_address) as holders
FROM token_balances
GROUP BY 1;
```