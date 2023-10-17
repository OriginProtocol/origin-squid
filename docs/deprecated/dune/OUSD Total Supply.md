# OUSD Total Supply

https://dune.com/embeds/278146/524806/476159a6-b7bb-4cf7-96e2-e74f99170b4a
https://dune.com/queries/278146/524806

```sql
DROP FUNCTION IF EXISTS dune_user_generated.data2bignumber(BYTEA, INT, INT);
CREATE OR REPLACE FUNCTION dune_user_generated.data2bignumber(data BYTEA, topic INT, decimals INT) RETURNS FLOAT AS $$
BEGIN
RETURN bytea2numeric(decode(SUBSTRING(ENCODE("data",'hex'),(1+(64*"topic")),64),'hex'))/POWER(10, "decimals");
END; $$
LANGUAGE PLPGSQL;

WITH rebase_logs AS (
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
    WHERE block_time > now() - interval '100 days'
    GROUP BY 1
    ORDER BY block_number DESC
)

SELECT 
block_date,
total_supply,
ROUND(AVG(total_supply) OVER (ORDER BY block_date ASC ROWS BETWEEN 29 PRECEDING AND CURRENT ROW)) as _30_day_total_supply,
ROUND(AVG(total_supply) OVER (ORDER BY block_date ASC ROWS BETWEEN 13 PRECEDING AND CURRENT ROW)) as _14_day_total_supply,
ROUND(AVG(total_supply) OVER (ORDER BY block_date ASC ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)) as _7_day_total_supply
FROM (
    SELECT
        block_date,
        total_supply
    FROM rebase_logs as t
    JOIN (
        SELECT
        date_trunc('day', block_time) as block_date,
        MAX(block_number) as max_block_number
        FROM rebase_logs
        GROUP BY 1
        ORDER BY 1 DESC
    ) t1 ON t.block_number = t1.max_block_number
    ORDER BY block_number DESC
) DATA
ORDER BY block_date DESC
```