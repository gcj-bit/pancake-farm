// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

let LOGS = {};

async function main() {
// ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    for(let i = 1; i<= 10; i++) {
        let TestToken = await ethers.getContractFactory(`LpTestToken`);
        let testToken = await TestToken.deploy(`My Test Lp Token ${i}`, `LPT${i}`, '1000000000000000000000');
        await testToken.deployed();
        LOGS[`LPT${i}`] = testToken.address;
        console.log(`Lp Token address ${i}:`, testToken.address);
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
        cacheDir + "/deploy-cache-lptokens.json",
        JSON.stringify(logs, undefined, 2)
    );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });