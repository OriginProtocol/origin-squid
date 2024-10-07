# Fork Deployments

Subsquid deployment status: https://app.subsquid.io/squids

## Guide

1. Get the public RPC URL for your fork.
2. Modify [squid.yaml](../squid.yaml) by modifying variables in the `Fork Setup Stage 1` section.
3. Deploy the squid.
4. Wait for processing to complete.
5. Modify [squid.yaml](../squid.yaml) by modifying variables in the `Fork Setup Stage 2` section.
6. Deploy the squid.
7. Wait for processing to complete.

At this point the squid will be running using the fork.

## FYI

### Fork Time Travelling

- Time travel in Tenderly will interrupt squid processing. It causes gaps to appear in the block height. To fix this you'd have to do some custom deployments navigating around the gaps.

```yaml
# Use this env variable to skip blocks
- BLOCK_FROM: 123456789 # block number after the time travel
```
