pragma solidity ^0.8.4;
// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Our very own shit coin :)
 */
contract HelixCollectiveShitCoin {
    /** Returns the amount of tokens in existence.  */
    uint256 public totalSupply = 1000000000 * 1e18;
    string public name = "Helix Collective Shit Coin";
    string public symbol = "HCSC";
    uint8 public decimals = 18;

    /** Returns the amount of tokens owned by `account` */
    mapping(address => uint256) public balanceOf;

    /**
     * Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    mapping(address => mapping(address => uint256)) public allowance;

    /**
     * Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool) {
        if (balanceOf[msg.sender] < amount) {
            return false;
        }

        balanceOf[recipient] += amount;
        balanceOf[msg.sender] -= amount;
        
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    /**
     * Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool) {
        // Can also crash upfront, most ERC20 implementations don't
        // require(balanceOf[spender] >= amount, "Sender doesn't have enough HSCS to allocate an allowance");

        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /**
     * Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool) {
        if (allowance[sender][msg.sender] > amount) {
            return false;
        }

        if (balanceOf[sender] < amount) {
            return false;
        }

        balanceOf[recipient] += amount;
        balanceOf[sender] -= amount;
        allowance[sender][msg.sender] -= amount;

        emit Transfer(sender, recipient, amount);
        return true;
    }

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }
}
