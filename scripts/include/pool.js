const config = require('../config');
const cache = require('../utils/cache');
const command = require('../utils/command');
const farm = require('./farm');

module.exports = {
    CACHE_KEY:'data-deploy-smartchef',
    async options() {
        let index = await command.choices('请选择需要的Farm操作：', [
            '查询所有已添加空投的Token ？',
            '添加新的空投Token ？',
        ]);
        switch (index) {
            case 1:
                this.queryAll();
                break;
            case 2:
                this.addDaiToken();
                break;
        }
    },
    async queryAll(){
        command.print(cache.get(this.CACHE_KEY));
    },
    async addDaiToken(){
        let logs = {}; //日志记录
        let farmConfig = cache.get(farm.CACHE_KEY);

        if(!farmConfig || !farmConfig.cakeToken || !farmConfig.cakeToken.address) {
            command.error("未检测到Cake Token的配置信息，请先部署Farm相关合约！", true);
        }
        /**
         * 输入空投代币信息
         */
        let inputValidate = function (value) {
            if(value.trim() !== '') {
                return true;
            }
            return "invalid input";
        }
        let inputConfig = [
            {
                name:'daitoken',
                message: '请输入要空投的token address：',
                validate: inputValidate
            },
            {
                name:'startBlock',
                message: '起始区块号：',
                validate: inputValidate
            },
            {
                name:'endBlock',
                default: '99999999',
                message: '结束区块号：',
                validate: inputValidate
            },
            {
                name:'rewardPerBlock',
                message: '每区块奖励token数量：',
                validate: inputValidate
            }
        ];
        let input = await command.prompt("请输入要空投代币配置信息：", inputConfig);
        let find = this._queryDaiToken(input.daitoken);
        if(find && !await command.confirm("检测到此代币已有Smartchef配置信息，是否需要重新部署空投？")) {
            return false;
        }

        let SmartChefToken = await ethers.getContractFactory(`SmartChef`);
        let smartChef = await SmartChefToken.deploy(
            farmConfig.cakeToken.address,
            input.daitoken,
            input.rewardPerBlock,
            input.startBlock,
            input.endBlock
        );
        await smartChef.deployed();
        input.smartChef = smartChef.address
        logs[input.daitoken] = input;
        console.log(`SmartChef Token address:`, smartChef.address);

        cache.append(this.CACHE_KEY, logs);
        command.success("SmartChef Pool部署完成，信息已保存至" + cache.filepath(this.CACHE_KEY));
    },
    async _queryDaiToken(tokenAddress) {
        let data = cache.get(this.CACHE_KEY);
        let find = null;
        for (let addr in data) {
            if(addr == tokenAddress) {
                find = data[addr];
            }
        }
        return find;
    }
}