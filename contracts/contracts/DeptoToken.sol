// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeptoToken is ERC20Votes, Ownable {
    uint256 public s_maxSupply = 1000000000000000000000000;

    constructor() ERC20("DeptoToken", "DT") ERC20Permit("DeptoToken") {}

    function recruitDAOMember(address memberAddress, uint tokenAmount)
        public
        onlyOwner
    {
        _mint(memberAddress, tokenAmount);
    }

    function transfer(
        address, /* to */
        uint /* amount */
    ) public pure override(ERC20) returns (bool) {
        revert("Cannot transfer soulbound Tokens");
    }

    function transferFrom(
        address, /* from */
        address, /* to */
        uint256 /* amount */
    ) public pure override returns (bool) {
        revert("Cannot transfer soulbound Tokens");
    }

    // The functions below are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._burn(account, amount);
    }
}
