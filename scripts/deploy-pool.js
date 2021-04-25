// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const CakeToken = await ethers.getContractFactory("CakeToken");
  const cakeToken = await CakeToken.deploy();
  await cakeToken.deployed();
  console.log("Cake Token address:", cakeToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });