const config = require('../config');
const cache = require('../utils/cache');
const command = require('../utils/command');

module.exports = {
    CACHE_KEY:'data-deploy-farm',
    async deploy(){
        let logs = {}; //日志记录
        /**
         * 1.检查配置项
         * 2.检查是否存在已部署的合约缓存信息
         */
        if(config.cakeToken.name.trim() == '') {
            command.error("请配置Cake Token合约的Name", true);
        }
        if(config.cakeToken.symbol.trim() == '') {
            command.error("请配置Cake Token合约的Symbol", true);
        }
        if(config.masterChef.startBlock.trim() == '') {
            command.error("请配置masterChef合约的startBlock[起始的区块号]", true);
        }
        if(config.masterChef.cakePerBlock.trim() == '') {
            command.error("请配置masterChef合约的cakePerBlock[每区块挖出CakeToken数量]", true);
        }
        if (cache.exists(this.CACHE_KEY)) {
            command.error("MasterChef已经部署过，如果要重新部署，请删除部署配置信息文件：" + cache.filepath(this.CACHE_KEY), true);
        }

        const [deployer] = await ethers.getSigners();
        //部署cake token
        const CakeToken = await ethers.getContractFactory("CakeToken");
        const cake = await CakeToken.deploy(
            config.cakeToken.name,
            config.cakeToken.symbol,
            config.cakeToken.creatorMintNumber,
        );
        await cake.deployed();
        logs.cakeToken = config.cakeToken;
        logs.cakeToken.address = cake.address;
        command.info("Cake Token address:" + cake.address);


        //部署syrupbar
        const SyrupBarToken = await ethers.getContractFactory("SyrupBar");
        const syrupBar = await SyrupBarToken.deploy(cake.address);
        await syrupBar.deployed();
        logs.syrupBarToken = syrupBar.address;
        command.info("SyrupBar Token address:" + syrupBar.address);

        //部署masterchef
        const MasterChefToken = await ethers.getContractFactory("MasterChef");
        const masterChef = await MasterChefToken.deploy(
            cake.address,
            syrupBar.address,
            deployer.getAddress(), //开发者地址
            config.masterChef.cakePerBlock,  //每个区块产生的cake token数量
            config.masterChef.startBlock, //heco 区块起始地址，部署的时候根据实际情况进行调整
        );
        await masterChef.deployed();
        logs.masterChef = config.masterChef;
        logs.masterChef.address = masterChef.address;
        command.info("MasterChef Token address:" + masterChef.address);

        //将cake以及syrupbar的所有权转移到masterchef
        await cake.transferOwnership(masterChef.address); //将CakeToken的Owner权限交给MasterChef
        command.info("CakeToken owner:" + await cake.owner());

        await syrupBar.transferOwnership(masterChef.address); //将SyrupBarToken的Owner权限交给MasterChef
        command.info("SyrupBar owner:" + await syrupBar.owner());

        cache.set(this.CACHE_KEY, logs);
        command.success("Farm部署完成，已部署合约：CakeToken、Masetrchef、SyrupBar，部署信息已保存至" + cache.filepath(this.CACHE_KEY));
    },
    async options() {
        let index = await command.choices('请选择需要的Farm操作：', [
            '查询指定LP Token的pid ？',
            '查询所有LP Token ？',
            '添加新的LP Token ？',
            '更新指定LP Token的allocPoint ？',
        ]);
        switch (index) {
            case 1:
                this.queryPid();
                break;
            case 2:
                this.queryAll();
                break;
            case 3:
                this.addLpToken();
                break;
            case 4:
                this.setLpTokenAllocPoint();
                break;
        }
    },
    async queryPid() {
        let farmConfig = cache.get(this.CACHE_KEY);

        if(!farmConfig || !farmConfig.masterChef || !farmConfig.masterChef.address) {
            command.error("未检测到MasterChef的配置信息，请先部署Farm相关合约！", true);
        }
        /**
         * 输入要素
         */
        let inputValidate = function (value) {
            if(value.trim() !== '') {
                return true;
            }
            return "invalid input";
        }
        let inputConfig = [
            {
                name:'lptoken',
                message: 'LP Token Address：',
                validate: inputValidate
            }
        ];
        let input = await command.prompt("查询LP Token Pid：", inputConfig);
        let find = this._queryPid(farmConfig.masterChef.address, input.lptoken);
        if(find > -1) {
            command.success("查询成功：" + input.lptoken + ', pid：' + find);
        } else {
            command.error("未查询到对应的pid，请检查lp token address是否输入正确！");
        }
    },
    async queryAll() {
        let farmConfig = cache.get(this.CACHE_KEY);

        if(!farmConfig || !farmConfig.masterChef || !farmConfig.masterChef.address) {
            command.error("未检测到MasterChef的配置信息，请先部署Farm相关合约！", true);
        }

        //连接masterchef
        const MasterChefToken = await ethers.getContractFactory("MasterChef");
        const masterChef = MasterChefToken.attach(farmConfig.masterChef.address);
        let len = (await masterChef.poolLength()).toNumber();
        let poolInfos = [];
        if(len > 0) {
            for (let i = 0; i < len; i++) {
                let pool = await masterChef.poolInfo(i);
                poolInfos.push(pool);
            }
        }
        command.print(poolInfos);
    },
    async addLpToken() {
        let farmConfig = cache.get(this.CACHE_KEY);

        if(!farmConfig || !farmConfig.masterChef || !farmConfig.masterChef.address) {
            command.error("未检测到MasterChef的配置信息，请先部署Farm相关合约！", true);
        }
        /**
         * 输入要素
         */
        let inputValidate = function (value) {
            if(value.trim() !== '') {
                return true;
            }
            return "invalid input";
        }
        let inputConfig = [
            {
                name:'lptoken',
                message: 'LP Token Address：',
                validate: inputValidate
            },
            {
                name:'allocPoint',
                message: 'allocPoint：',
                validate: inputValidate
            }
        ];
        let input = await command.prompt("添加LP Token：", inputConfig);
        let find = this._queryPid(farmConfig.masterChef.address, input.lptoken);
        if(find > -1) { //检查该lp token是否已经存在池子中！
            command.success("此lp token已经存在于MasterChef pool中[pid:" + find + "]，请勿重复添加！", true);
        }
        //连接masterchef
        const MasterChefToken = await ethers.getContractFactory("MasterChef");
        const masterChef = MasterChefToken.attach(farmConfig.masterChef.address);

        await masterChef.add(parseInt(input.allocPoint), input.lptoken, false);
        await masterChef.massUpdatePools();
        let len = await masterChef.poolLength();
        command.success("添加成功：");
        command.print({ //输出添加的lp token信息
            "lptoken":input.lptoken,
            "allocPoint":input.allocPoint,
            "pid":len - 1,
        });
    },
    async setLpTokenAllocPoint(){
        let farmConfig = cache.get(this.CACHE_KEY);

        if(!farmConfig || !farmConfig.masterChef || !farmConfig.masterChef.address) {
            command.error("未检测到MasterChef的配置信息，请先部署Farm相关合约！", true);
        }
        /**
         * 输入要素
         */
        let inputValidate = function (value) {
            if(value.trim() !== '') {
                return true;
            }
            return "invalid input";
        }
        let inputConfig = [
            {
                name:'lptoken',
                message: 'LP Token Address：',
                validate: inputValidate
            },
            {
                name:'allocPoint',
                message: 'allocPoint：',
                validate: inputValidate
            }
        ];
        let input = await command.prompt("更新LP Token allocPoint：", inputConfig);
        let find = this._queryPid(farmConfig.masterChef.address, input.lptoken);
        if(find == -1) { //检查该lp token是否已经存在池子中！
            command.error("MasterChef Pool中未查询到此LP Token，无法继续！", true);
        }
        //连接masterchef
        const MasterChefToken = await ethers.getContractFactory("MasterChef");
        const masterChef = MasterChefToken.attach(farmConfig.masterChef.address);

        //function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate) public onlyOwner {}
        await masterChef.set(find, input.allocPoint, true);
        command.success("更新成功：");
        command.print({ //输出添加的lp token信息
            "lptoken":input.lptoken,
            "allocPoint":input.allocPoint,
            "pid":find,
        });
    },
    async _queryPid(masterChefAddr, lpToken) {
        //连接masterchef
        const MasterChefToken = await ethers.getContractFactory("MasterChef");
        const masterChef = MasterChefToken.attach(masterChefAddr);

        let len = (await masterChef.poolLength()).toNumber();
        let find = -1;
        if(len > 0) {
            for (let i = 0; i < len; i++) {
                let poolInfo = await masterChef.poolInfo(i);
                if(lpToken.toLowerCase() == poolInfo.lpToken.toLowerCase()) {
                    find = i;
                }
            }
        }
        return find;
    }
}