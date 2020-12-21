pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract StakingToken is ERC20, ERC20Detailed {
  uint bil = 1000*1000*1000;

  constructor(string memory _name, string memory _symbol, uint8 _decimals) 
    ERC20Detailed(_name, _symbol, _decimals)
    public {
      _mint(msg.sender, 10*1000*bil*bil); // mint 10 thousand tokens (note: 18 decimal places)
  }
}
