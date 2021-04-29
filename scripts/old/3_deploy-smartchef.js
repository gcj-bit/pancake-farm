// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
let masterChefCache = require('../cache/deploy-cache-masterchef.json')
let earningsCache = require('../cache/deploy-cache-earningTokens3.json')
let LOGS = [];

//syrup token address
const SYRUP_ADDR = masterChefCache.cakeToken;

//每个区块奖励数量
const REWARD_PER_BLOCK = '6080000000';
// const REWARD_PER_BLOCK = '40000000000000000000';

// 质押奖励开始起始区块
const START_BLOCK = masterChefCache.startBlock;
const END_BLOCK = 8516900;

async function main() {
// ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    for(let i in earningsCache) {
        let SmartChefToken = await ethers.getContractFactory(`SmartChef`);
        let smartChef = await SmartChefToken.deploy(
            SYRUP_ADDR,
            earningsCache[i],
            REWARD_PER_BLOCK,
            START_BLOCK,
            END_BLOCK
        );
        await smartChef.deployed();
        LOGS.push(smartChef.address);
        console.log(`SmartChef Token address ${i}:`, smartChef.address);
    }
    // 保存地址信息部署记录
    saveDeployCacheFiles(LOGS);
}
function saveDeployCacheFiles(logs) {
    const fs = require("fs");
    const cacheDir = __dirname + "/../cache/";

    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
    }
    fs.writeFileSync(
        cacheDir + "/deploy-cache-smartchef2.json",
        JSON.stringify(logs, undefined, 2)
    );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });