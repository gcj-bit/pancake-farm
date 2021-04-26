# Farm Deploy 

# Local Development

The following assumes the use of `node@>=10`.
## 初始化配置

```
mv hardhat.config.example hardhat.config.js
```
>部署前请注意更新`ALCHEMY_API_KEY`及`ROPSTEN_PRIVATE_KEY`

## 安装依赖

```
yarn install
```

## 编译合约

```
npx hardhat compile
```

## Run Tests

```
npx builder test
```

## 设置挖矿参数

更新`scripts/1_deploy-masterchef.js`的配置参数`CAKE_PER_BLOCK` 及 `START_BLOCK`

## 设置pool质押奖励参数

更新`scripts/2_deploy-pool.js`的配置参数`REWARD_PER_BLOCK`

## 部署到heco

```
npx hardhat run --network heco scripts/1_deploy-masterchef.js
npx hardhat run --network heco scripts/2_deploy-pool.js
```