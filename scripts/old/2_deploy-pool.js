// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
let masterChefCache = require('../cache/deploy-cache-masterchef.json')

//syrup token address
const SYRUP_ADDR = masterChefCache.cakeToken;

//每个区块奖励数量
const REWARD_PER_BLOCK = '6080';

// 质押奖励开始起始区块
const START_BLOCK = masterChefCache.startBlock;

// 质押奖励结束截止区块
const END_BLOCK = 8516900;
let LOGS = {

};

async function main() {
    // ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const SousChefToken = await ethers.getContractFactory("SousChef");
    const sousChef = await SousChefToken.deploy(
        SYRUP_ADDR,
        REWARD_PER_BLOCK,
        START_BLOCK,
        END_BLOCK
    );
    await sousChef.deployed();
    LOGS.sousChef = sousChef.address;
    console.log("SousChef Token address:", sousChef.address);

    // const MulticallToken = await ethers.getContractFactory("Multicall");
    // const multicall = await MulticallToken.deploy();
    // await multicall.deployed();
    // LOGS.multicall = multicall.address;
    // console.log("Multicall Token address:", multicall.address);
    // saveDeployCacheFiles(LOGS);
}

function saveDeployCacheFiles(logs) {
    const fs = require("fs");
    const cacheDir = __dirname + "/../cache/";

    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
    }

    fs.writeFileSync(
        cacheDir + "/deploy-cache-pool.json",
        JSON.stringify(logs, undefined, 2)
    );
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });