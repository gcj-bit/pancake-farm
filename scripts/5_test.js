// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
let masterchefAddr = require('../cache/deploy-cache-masterchef.json')['masterChef'];
let cakeAddr = require('../cache/deploy-cache-masterchef.json')['cakeToken'];

async function main() {
    // ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying the contracts with the account:",
        await deployer.getAddress()
    );

    const CakeToken = await ethers.getContractFactory("CakeToken");
    const cake = CakeToken.attach(cakeAddr);
    console.log(cake)
    cake.mint(50000);
    console.log(await cake.totalSupply());


}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });