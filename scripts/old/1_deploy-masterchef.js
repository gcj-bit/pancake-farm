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
  const cake = await CakeToken.deploy(
      'Cake Token',
      'CakeToken',
      '5000000000000000000000'
  );
  await cake.deployed();
  LOGS.cakeToken = cake.address;
  console.log("Cake Token address:", cake.address);

  const SyrupBarToken = await ethers.getContractFactory("SyrupBar");
  const syrupBar = await SyrupBarToken.deploy(cake.address);
  await syrupBar.deployed();
  LOGS.syrupBarToken = syrupBar.address;
  console.log("SyrupBar Token address:", syrupBar.address);


  const MasterChefToken = await ethers.getContractFactory("MasterChef");
  const masterChef = await MasterChefToken.deploy(
      cake.address,
      syrupBar.address,
      deployer.getAddress(), //开发者地址
      CAKE_PER_BLOCK,  //每个区块产生的cake token数量
      START_BLOCK, //heco 区块起始地址，部署的时候根据实际情况进行调整
  );

  await masterChef.deployed();
  LOGS.masterChef = masterChef.address;
  console.log("MasterChef Token address:", masterChef.address);

  await cake.transferOwnership(masterChef.address); //将CakeToken的Owner权限交给MasterChef
  console.log("CakeToken owner:", await cake.owner());

  await syrupBar.transferOwnership(masterChef.address); //将SyrupBarToken的Owner权限交给MasterChef
  console.log("SyrupBar owner:", await syrupBar.owner());

  //保存地址信息部署记录
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