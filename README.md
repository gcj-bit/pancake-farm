# Farm Deploy 

# Local Development

The following assumes the use of `node@>=10`.
## 初始化配置

`mv hardhat.config.example hardhat.config.js`
>部署前请注意更新`ALCHEMY_API_KEY`及`ROPSTEN_PRIVATE_KEY`

## 安装依赖

`yarn install`

## 编译合约

`npx hardhat compile`

## Run Tests

`npx builder test`

## 部署到heco

`npx hardhat run --network heco scripts/deploy-masterchef.js`