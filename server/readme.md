### UNDERWATER

## Scan Compound.finance protocol and get Underwater Accounts For liquidation

```shell
    yarn install or npm install
```

### steps

1. Run docker container : See file ./docer/docker-compose.yaml whic includes Postgres and redis instance

```shell
    cd ./docker
    docker-compose up
```

2. Create Table ./docs/schema.sql

3. Run script: accountSnapshot.ts

```
    ts-node ./src/accountSnapshot.ts
```

```shell
    // Run ganache in fork mode
    ganache-cli -f http://159.69.75.162:8545 -i 1  --unlock=0x3c6809319201b978d821190ba03fa19a3523bd96

```
