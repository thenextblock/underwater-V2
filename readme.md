# UNDERWATER

## System Architechture

1. Server

   1.1 Scanner

   1.2 API Service

   1.3 Docker

   ​ 1.3.1. Posrgres

   ​ 1.3.2 Redis

2. Client

3. Infrastructure:

4. SMARTCONTRACTS

5. Running System

**#TODO**

**FINISH AND TEST PLAYGROUND SMARTCONTRACT The modified getAccountLiquidtiy. It will speedup the fetching and data analys.**

---

## 1. Server

### 1.1 Scanner

# Run System

1. Run Docker - (Docker compose in Server folder)

2. Run New account script: `ts-node or pm2 start ./server/scanner/addAccountsIntoDatabase.ts`

3. Run Oracle Listener Service: ts-node or pm2 start ./server/scanner/oracleListener.ts

   1. Oracle Listener will execute: `accountSnapshot.ts` script every every price update. (TODO: check if price is lower or higher)

**##** **Working With Redis CLient**

**install**

```
npm install --global rdcli
```

_Connecting Redis viaCLI_

```
rdcli -h localhost
```

**Redis CLI Commands**

_List all keys_

```
KEYS *
```

_search keys_

```
KEYS keys bull:cronjobs:*
```

_Clear FLUSH Database_

```
FLUSHHALL
```

How to Empty Quee Programatically : https://github.com/OptimalBits/bull/issues/709
