# OUSD holder breakdown

https://dune.xyz/embeds/285485/539422/ea76c2ad-232d-4001-9c78-ecf5231b9700
https://dune.com/queries/278734/528075

```sql
DROP FUNCTION IF EXISTS dune_user_generated.data2bignumber(BYTEA, INT, INT);
CREATE OR REPLACE FUNCTION dune_user_generated.data2bignumber(data BYTEA, topic INT, decimals INT) RETURNS FLOAT AS $$
BEGIN
RETURN bytea2numeric(decode(SUBSTRING(ENCODE("data",'hex'),(1+(64*"topic")),64),'hex'))/POWER(10, "decimals");
END; $$
LANGUAGE PLPGSQL;

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

latest_rebase as (
    SELECT * from rebase_logs
    ORDER BY block_number DESC
    LIMIT 1
),

token_balances as (
    SELECT address as wallet_address, SUM(credits / 1e18) / MAX(latest_rebase.rebasing_credits_per_token) as amount FROM
    transfer_with_credits_per_token,
    latest_rebase
    GROUP BY 1
)

-- TODO INSPECT THIS
-- last rebasing credits per token: 0.8369875568128926
-- TODO some token holders have balances way off like this account: \x96feb7b6f808dd2bbd09c9e5ccde77cabd58d019 (has a lot of transactions)
-- SELECT SUM(amount / 1e18), SUM(credits / 1e18) FROM transfer_with_credits_per_token
-- WHERE address = '\x96feb7b6f808dd2bbd09c9e5ccde77cabd58d019'
-- GROUP BY address

Select 
    CASE
        when wallet_address = '\x87650D7bbfC3A9F10587d7778206671719d9910D' then 'Curve Metapool'
        when wallet_address = '\x129360c964e2e13910d603043f6287e5e9383374' then 'Uniswap V3: OUSD - USDT'
        -- when labels.get(wallet_address, 'project', 'contract_name')::text is not NULL then labels.get(wallet_address, 'project', 'contract_name', 'ens name')::text
        when amount     between  0      and 100        then 'mini 0-100 OUSD'
        when amount     between 100     and 1000        then 'light 100-1k OUSD'
        when amount     between 1000    and 10000       then 'heavy 1k-10k'
        when amount     between 10000    and 100000     then 'full 10k-100k'
        when amount     > 100000                       then 'enormous >100k'
        end as holder_type,
    sum(amount) as amount,
    count(distinct wallet_address) as holders
from token_balances
where wallet_address != '\x0000000000000000000000000000000000000000' and
amount > 0
group by 1
```