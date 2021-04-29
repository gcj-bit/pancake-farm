// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
let masterchefAddr = require('../cache/deploy-cache-masterchef.json')['masterChef'];
let cakeAddr = require('../cache/deploy-cache-masterchef.json')['cakeToken'];

async function main() {
    const MasterChefToken = await ethers.getContractFactory("MasterChef");
    const masterChef = MasterChefToken.attach(masterchefAddr);
    console.log('master chef owner:', await masterChef.owner());

    // await masterChef.add(100, '0xdc6998f3aeed59db533f7c9dbe5e8a0d52580723', false);
    // await masterChef.add(100, '0xf94c674f76de9d30b5c5ca7fd6d15d4a33b37176', false);
    // await masterChef.add(100, '0x6106a445aec76565195adc7df9c4468a8c5d6f51', false);
    // await masterChef.massUpdatePools();
    console.log('poolLength:', await masterChef.poolLength());


    //
    // let lptokens = require('../cache/deploy-cache-lptokens.json');
    // for(let i in lptokens) {
    //     await masterChef.add(100, lptokens[i], false); //添加lp token到pool中
    //     console.log('poolLength:', await masterChef.poolLength());
    // }
    // await masterChef.massUpdatePools();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });