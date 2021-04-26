// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

//每块产生的cake token数量
const CAKE_PER_BLOCK = '40000000000000000000';

// 挖矿起始块号
const START_BLOCK = '4171400';

let LOGS = {
  cakePerBlock:CAKE_PER_BLOCK,
  startBlock:START_BLOCK,
};

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
  LOGS.cacheToken = cakeToken.address;
  console.log("Cake Token address:", cakeToken.address);

  const SyrupBarToken = await ethers.getContractFactory("SyrupBar");
  const syrupBarToken = await SyrupBarToken.deploy(cakeToken.address);
  await syrupBarToken.deployed();
  LOGS.syrupBarToken = syrupBarToken.address;
  console.log("SyrupBar Token address:", syrupBarToken.address);

  const MasterChefToken = await ethers.getContractFactory("MasterChef");
  const masterChef = await MasterChefToken.deploy(
      cakeToken.address,
      syrupBarToken.address,
      deployer.getAddress(), //开发者地址
      CAKE_PER_BLOCK,  //每个区块产生的cake token数量
      START_BLOCK, //heco 区块起始地址，部署的时候根据实际情况进行调整
  );

  await masterChef.deployed();
  LOGS.masterChef = masterChef.address;
  console.log("MasterChef Token address:", masterChef.address);

  await cakeToken.transferOwnership(masterChef.address); //将CakeToken的Owner权限交给MasterChef
  console.log("CakeToken owner:", await cakeToken.owner());

  // We also save the contract's artifacts and address in the frontend directory
  saveDeployCacheFiles(LOGS);
}


function saveDeployCacheFiles(logs) {
  const fs = require("fs");
  const cacheDir = __dirname + "/../cache/";

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }

  fs.writeFileSync(
      cacheDir + "/deploy-cache-masterchef.json",
      JSON.stringify(logs, undefined, 2)
  );
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });