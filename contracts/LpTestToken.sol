//SPDX-License-Identifier: Unlicense
pragma solidity 0.6.12;

import "hardhat/console.sol";

contract Erc20 {
    // The fixed amount of tokens stored in an unsigned integer type variable.
    uint256 public totalSupply = 1000000000;

    address payable owner;

    // 存储每个地址的余额（因为是public的所以会自动生成balanceOf方法）
    mapping (address => uint256) public balanceOf;

    // 存储每个地址可操作的地址及其可操作的金额
    mapping (address => mapping (address => uint256)) internal allowed;

}

contract LpTestToken is Erc20 {
    // Some string type variables to identify the token.
    string public name = "My Test Lp Token";
    string public symbol = "LPT";


    // 代币交易时触发的事件，即调用transfer方法时触发
    event Transfer(address indexed from, address indexed to, uint tokens);

    // 允许其他用户从你的账户上花费代币时触发的事件，即调用approve方法时触发
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     * The `public` modifier makes a function callable from outside the contract.
     */
    constructor (string memory _name, string memory _symbol) public {
        // The totalSupply is assigned to transaction sender, which is the account
        // that is deploying the contract.
        name = _name;
        symbol = _symbol;
        owner = payable(msg.sender);
    }

    function transfer(address to, uint tokens) public returns (bool success) {
        // 检验接收者地址是否合法
        require(to != address(0), "无效转账地址");

        require(to != msg.sender, "不可给自己转账");

        // 检验发送者账户余额是否足够
        require(balanceOf[msg.sender] >= tokens, "合约余额不足");

        // 检查有没有发生溢出，因为数量有可能超过uint256可存储的范围
        require(balanceOf[to] + tokens >= balanceOf[to], "数据溢出，操作异常");

        // 扣除发送者账户余额
        balanceOf[msg.sender] -= tokens;

        // 增加接收者账户余额
        balanceOf[to] += tokens;

        // 触发相应的事件
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    /**
     * @dev Creates `amount` tokens and assigns them to `msg.sender`, increasing
     * the total supply.
     *
     * Requirements
     *
     * - `msg.sender` must be the token owner
     */
    function mint(uint256 amount) public returns (bool) {
        require(owner == msg.sender, "无权操作！");
        _mint(msg.sender, amount);
        return true;
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements
     *
     * - `to` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), 'BEP20: mint to the zero address');

        totalSupply += amount;
        balanceOf[account] += amount;
        emit Transfer(address(0), account, amount);
    }


    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        // 检验地址是否合法
        require(to != address(0) && from != address(0), "无效转账地址");

        require(to != from, "不可给自己转账");

        // 检验发送者账户余额是否足够
        require(balanceOf[from] >= tokens, "余额不足");

        // 检验操作的金额是否是被允许的
        require(allowed[from][msg.sender] <= tokens, "操作被拒绝");

        // 检查有没有发生溢出，因为数量有可能超过uint256可存储的范围
        require(balanceOf[to] + tokens >= balanceOf[to], "数据溢出，操作异常");

        // 扣除发送者账户余额
        balanceOf[from] -= tokens;

        // 增加接收者账户余额
        balanceOf[to] += tokens;

        // 触发相应的事件
        emit Transfer(from, to, tokens);
        return true;
    }


    function approve(address spender, uint tokens) public returns (bool success) {
        require(owner == msg.sender, "无权操作！");
        allowed[msg.sender][spender] = tokens;
        // 触发相应的事件
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
}
