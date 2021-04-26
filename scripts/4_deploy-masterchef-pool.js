// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
let masterchefAddr = require('../cache/deploy-cache-masterchef.json')['masterChef'];
let cakeAddr = require('../cache/deploy-cache-masterchef.json')['cakeToken'];

async function main() {
    const CakeToken = await ethers.getContractFactory("CakeToken");
    const cake = CakeToken.attach(cakeAddr);
    console.log('cake token owner:', await cake.owner());

    const MasterChefToken = await ethers.getContractFactory("MasterChef");
    const masterChef = MasterChefToken.attach(masterchefAddr);
    console.log('master chef owner:', await masterChef.owner());

    let lptokens = require('../cache/deploy-cache-lptokens.json');
    for(let i in lptokens) {
        await masterChef.add(100, lptokens[i], false); //添加lp token到pool中
        console.log('poolLength:', await masterChef.poolLength());
    }
    await masterChef.massUpdatePools();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });