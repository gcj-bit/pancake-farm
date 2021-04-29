// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
let daiTokens = require('../cache/deploy-cache-daitokens.json');
async function main() {
// ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    let addresses = [
        '0xd276b82F01BF3308CF33a0216cf663cA0CA0D4C5',
        '0xDcd3B645690275c361D2085657ea5EC7dE075534',
        '0x4803017c94072D7871Fd80580ffDaB5C049d8035',
        '0x157024ddffa168b75a17F7AFceE4fc2D7E9C1175',
        '0x6f604Bd1AC72dD34bA79Cd9b0F53B7bD088D1b04',
        '0x4Ee441E8a1b12a146bDa07dCf6213759802DC654',
        '0x04D1C1C3DD62e5EF25C72B34d78d1d358976A0A5',
        '0xD8949fC009DaB125Cda01159556A9020BBC423c9',
    ];
    for(let i in daiTokens) {
        let DaiToken = await ethers.getContractFactory(`PoolToken`);
        const dai = DaiToken.attach(daiTokens[i]);
        for(var j in addresses) {
            console.log('transfer to :', addresses[j], ', result:', await dai.transfer(addresses[j], '10000000000000000000000000'));
        }
    }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });