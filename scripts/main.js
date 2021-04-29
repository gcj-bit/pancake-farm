const command = require('./utils/command');
const cache = require('./utils/cache');
const farm = require('./include/farm');
const pool = require('./include/pool');




async function main() {

    // ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    command.warn(
        "Work with the account:" +
        await deployer.getAddress()
    );
    command.warn("Account balance:" + (await deployer.getBalance()).toString());

    if(!await command.confirm("是否使用此账户继续操作？")) {
        return;
    }

    let index = await command.choices('请选择操作：', [
        '部署Farm：初始化部署Farm功能相关合约',
        '更新Farm：添加LP Token、查询LP Token信息等',
        '更新Pool：添加空投代币、查询已添加的空投代币等'
    ]);
    switch (index) {
        case 1:
            farm.deploy();
            break;
        case 2:
            farm.options();
            break;
        case 3:
            pool.options();
            break;
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });