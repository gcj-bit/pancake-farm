// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
let masterchefAddr = require('../cache/deploy-cache-masterchef.json')['masterChef'];
let lpTokens = require('../cache/deploy-cache-lptokens.json');
let LOGS = {};
let POOLINFO = [];

async function main() {

    const SmartChefToken = await ethers.getContractFactory("SmartChef");
    const smartChef = MasterChefToken.attach(SmartChefToken);

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });