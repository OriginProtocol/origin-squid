# OUSD buybacks

https://dune.com/embeds/284111/536003/6b5abcab-4856-4590-b03f-47da6959202e
https://dune.com/queries/284111/536003

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
            ROUND(value / 1e18) AS amount
        FROM ousd."OusdImplementation_evt_Transfer"
        WHERE evt_block_number > 11596940 -- OUSD V2 block number
        AND "to" = '\x77314eb392b2be47c014cde0706908b3307ad6a9'
        AND "from" = '\x0000000000000000000000000000000000000000'
        
        -- UNION ALL 
        
        -- SELECT evt_block_number,
        --     "to" AS address,
        --     evt_block_time,
        --     ROUND(value / 1e18) AS amount
        -- FROM ousd."OusdImplementation_evt_Transfer"
        -- WHERE evt_block_number > 11596940 -- OUSD V2 block number
        -- AND "to" = '\x7d82E86CF1496f9485a8ea04012afeb3C7489397'
        -- AND "from" = '\x0000000000000000000000000000000000000000'
    ) t
),

ogn_transfers AS (
    SELECT evt_block_time,
    ROUND(value / 1e18) as value
    FROM erc20."ERC20_evt_Transfer" tr
    WHERE tr."to" = '\x77314eb392b2be47c014cde0706908b3307ad6a9'
    and contract_address='\x8207c1ffc5b6804f6024322ccf34f29c3541ae26'
),

ogv_transfers AS (
    SELECT evt_block_time,
    ROUND(value / 1e18) as value
    FROM erc20."ERC20_evt_Transfer" tr
    WHERE tr."to" = '\x7d82E86CF1496f9485a8ea04012afeb3C7489397'
    and contract_address='\x9c354503C38481a7A7a51629142963F98eCC12D0'
)

SELECT 
COALESCE(OUSD_DATA.day, OGN_DATA.day, OGV_DATA.day) as day,
OUSD_DATA.amount as ousd_amount,
OGN_DATA.amount as ogn_amount,
OGV_DATA.amount as ogv_amount
FROM (
    SELECT day, 
    SUM(amount) OVER (ORDER BY day ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as amount
    FROM (
        SELECT 
          date_trunc('day', block_time) as day,
          SUM(amount) as amount
        FROM transfers
        GROUP BY 1
    ) OUSD_DATA
) OUSD_DATA FULL OUTER JOIN (
    SELECT day, 
    SUM(amount) OVER (ORDER BY day ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as amount
    FROM (
        SELECT 
          date_trunc('day', evt_block_time) as day,
          SUM(value) as amount
        FROM ogn_transfers
        GROUP BY 1
    ) OGN_DATA
) OGN_DATA 
ON OUSD_DATA.day = OGN_DATA.day
FULL OUTER JOIN (
    SELECT day, 
    SUM(amount) OVER (ORDER BY day ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as amount
    FROM (
        SELECT 
          date_trunc('day', evt_block_time) as day,
          SUM(value) as amount
        FROM ogv_transfers
        GROUP BY 1
    ) OGV_DATA
) OGV_DATA
ON OUSD_DATA.day = OGV_DATA.day
ORDER BY 1 desc
```