// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
let masterchefAddr = require('../cache/deploy-cache-masterchef.json')['masterChef'];
let lpTokens = require('../cache/deploy-cache-lptokens.json');
let LOGS = {};
let POOLINFO = [];

async function main() {

    const MasterChefToken = await ethers.getContractFactory("MasterChef");
    const masterChef = MasterChefToken.attach(masterchefAddr);
    let len = (await masterChef.poolLength()).toNumber();
    console.log('pool len:', len)
    for (let i = 0; i < len; i++) {
        let poolInfo = await masterChef.poolInfo(i);
        POOLINFO.push(poolInfo);
        for(let key in lpTokens) {
            if(lpTokens[key].toLowerCase() == poolInfo.lpToken.toLowerCase()) {
                LOGS[key] = i;
                break;
            }
        }
    }
    console.log('lp tokens logs:', LOGS);
    saveDeployCacheFiles(LOGS, POOLINFO);
}
function saveDeployCacheFiles(logs, poolinfos) {
    const fs = require("fs");
    const cacheDir = __dirname + "/../cache/";

    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
    }
    fs.writeFileSync(
        cacheDir + "/deploy-cache-lptokens-pids.json",
        JSON.stringify(logs, undefined, 2)
    );
    fs.writeFileSync(
        cacheDir + "/deploy-cache-lptokens-poolinfo.json",
        JSON.stringify(poolinfos, undefined, 2)
    );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });