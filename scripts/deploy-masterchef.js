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

  const SyrupBarToken = await ethers.getContractFactory("SyrupBar");
  const syrupBarToken = await SyrupBarToken.deploy(cakeToken.address);
  await syrupBarToken.deployed();
  console.log("SyrupBar Token address:", syrupBarToken.address);

  const MasterChefToken = await ethers.getContractFactory("MasterChef");
  const masterChef = await MasterChefToken.deploy(
      cakeToken.address,
      syrupBarToken.address,
      deployer.getAddress(), //开发者地址
      '40000000000000000000',  //每个区块产生的cake token数量
      '4149493', //heco 区块起始地址，部署的时候根据实际情况进行调整
  );
  await masterChef.deployed().then(async (MasterChefInstance)=>{
    await cakeToken.transferOwnership(MasterChefInstance.address); //将CakeToken的Owner权限交给MasterChef
    console.log("CakeToken owner:", await cakeToken.owner());
  });
  console.log("MasterChef Token address:", masterChef.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });