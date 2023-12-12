WITH base as (
  SELECT
    timestamp as time,
    address,
    balance0 / 1e18 / ((balance0 / 1e18) + (balance1 / 1e18) + (balance2 / 1e18)) as weight
  FROM balancer_pool_balance
)

select
  max(weight) as highest_weight
from base
where
  address = '0x1e19cf2d73a72ef1332c882f20534b6519be0276'
group by time, address
order by time desc, highest_weight desc
limit 1