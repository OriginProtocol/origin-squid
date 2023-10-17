# OUSD average & median (only accounts over 10 OUSD)

https://dune.xyz/embeds/283166/534275/1d88ccea-eec7-4e8f-9a86-3bc47b605053
https://dune.com/queries/283166/534275

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
-- TODO INSPECT THIS
-- last rebasing credits per token: 0.8369875568128926
-- TODO some token holders have balances way off like this account: \x96feb7b6f808dd2bbd09c9e5ccde77cabd58d019 (has a lot of transactions)
-- SELECT SUM(amount / 1e18), SUM(credits / 1e18) FROM transfer_with_credits_per_token
-- WHERE address = '\x96feb7b6f808dd2bbd09c9e5ccde77cabd58d019'
-- GROUP BY address

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
        HAVING SUM(t.credits / 1e18) > 0
    ) b
    ON r.day = b.day
    ORDER BY 1 desc
),

token_balances_over_10 AS (
    SELECT * 
    FROM token_balances
    WHERE balance > 10
)

SELECT
 s.day,
 s.average,
 s.median
--  s1.average_over_100,
--  s1.median_over_100
FROM
(
    select day,
    ROUND(avg(balance) filter (WHERE balance > 0)) as average,
    ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY balance)) as median
    FROM token_balances_over_10
    GROUP BY 1
) s 
-- INNER JOIN
-- (
--     select day,
--     ROUND(avg(balance) filter (WHERE balance > 0)) as average_over_100,
--     ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY balance)) as median_over_100
--     FROM token_balances_over_100
--     GROUP BY 1
-- ) s1
-- ON s.day = s1.day
ORDER BY day DESC
```