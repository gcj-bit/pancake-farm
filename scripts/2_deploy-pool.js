// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
let masterChefCache = require('../cache/deploy-cache-masterchef.json')

//syrup token address
const SYRUP_ADDR = masterChefCache.syrupBarToken;

//每个区块奖励数量
const REWARD_PER_BLOCK = '40000000000000000000';

// 质押奖励开始起始区块
const START_BLOCK = masterChefCache.startBlock;

// 质押奖励结束截止区块
const END_BLOCK = 9999999;

async function main() {
    // ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const SousChefToken = await ethers.getContractFactory("SousChef");
    const sousChefToken = await SousChefToken.deploy(
        SYRUP_ADDR,
        REWARD_PER_BLOCK,
        START_BLOCK,
        END_BLOCK
    );
    await sousChefToken.deployed();
    console.log("SousChef Token address:", sousChefToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });