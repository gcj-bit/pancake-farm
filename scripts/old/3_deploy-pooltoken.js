// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
let LOGS = [];
async function main() {
// ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    for(let i = 1; i<= 1; i++) {
        let PoolToken = await ethers.getContractFactory(`PoolToken`);
        let earningToken = await PoolToken.deploy(`Pool Token ${i}`, `PTT${i}`, '1000000000000000000000000000');
        await earningToken.deployed();
        LOGS.push(earningToken.address);
        console.log(`Earning Token address ${i}:`, earningToken.address);
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
        cacheDir + "/deploy-cache-earningTokens3.json",
        JSON.stringify(logs, undefined, 2)
    );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });