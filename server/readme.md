# UNDERWATER

## Services: (scheduler jobs)

- Scheduler job runs under bull scheduler (no cronjob)

### - ACCOUNTS FETCHER (JOB)

- 1. /scanner/pastEvents.ts
- It fetchs all accounts : marketEntered() event logs
- We also getting latest blockNumber from the database
- SCEDULER: every 2 hours:
- Database Table: accounts

#### - ACCOUNT IFO (JOB)

- /scanner/accountInfo.ts
- It fetchs all accounts from accounts and calls accountinfo agregator smartcontract for each account address,
- loads : collateral and borrow numebrs for each accounts
- SCHEDULER: every 1 hour.
- Database Table: account_info

#### -- ACCOUNT SNAPSHOT (Depends on oracleListener.ts)

-- /scanner/accountSnapshot.ts

#### -- ORACLE ELISTENER

- ./scanner/oracleListener.ts
- ws connector listens priceUpdate Events and for each events and
- executes ACCOUNT SNAPSHOT (accounsSnapshot.ts)

### Setup Bot

Run Schedulers separatelly: pastEvents & accountInfo
Run Oracle Listerener

```bash

    buld: tsc -w
    pm2 start  ./build/scanner/pastEvents.js
    pm2 start  ./build/scanner/accountInfo.js
    pm2 start  ./build/scanner/oracleListener.js

```

## Scan Compound.finance protocol and get Underwater Accounts For liquidation

```shell
    yarn install or npm install
```

### steps

1. Run docker container : See file ./docer/docker-compose.yaml Postgres and redis instance

```shell
    cd ./docker
    docker-compose up
```

```shell
    // Run ganache in fork mode
    ganache-cli -f http://159.69.75.162:8545 -i 1  --unlock=0x3c6809319201b978d821190ba03fa19a3523bd96

```

### RPC COMMANDS

- eth_blockNumber

```bash

    curl --location -g --request POST 'http://localhost:8545' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "jsonrpc":"2.0",
            "method":"eth_blockNumber",
            "params":[],
            "id":1
        }'

curl --location -g --request POST 'http://65.108.206.172:8545' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "jsonrpc":"2.0",
            "method":"eth_blockNumber",
            "params":[],
            "id":1
        }'

```
