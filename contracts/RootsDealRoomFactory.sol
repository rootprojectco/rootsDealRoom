pragma solidity ^0.4.21;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./RootsDealRoom.sol";

contract RootsDealRoomFactory is Ownable {

    using SafeMath for uint256;

    struct Deal {
        address addr;
        address owner;
        address beneficiary;
        uint256 dealEndTime;
        uint256 index;
    }

    // address of Roots token
    address public tokenAddress;

    // ---====== DEALS ======---
    /**
     * @dev Get deal object by address
     */
    mapping(address => Deal) public deals;

    /**
     * @dev Contracts addresses list
     */
    address[] public dealsAddr;

    /**
     * @dev Count of contracts in list
     */
    function numDeals() public view returns (uint256)
    { return dealsAddr.length; }

    // ---====== CONSTRUCTOR ======---

    constructor(address _rootsToken) public {
        require(_rootsToken != 0x0);
        tokenAddress = _rootsToken;
    }

    function changeTokenAddress(address _rootsToken) onlyOwner public {
        require(_rootsToken != 0x0);
        tokenAddress = _rootsToken;
    }

    function create(address _beneficiary, uint256 _dealEndTime) public returns (RootsDealRoom) {
        RootsDealRoom newContract = new RootsDealRoom(_beneficiary, tokenAddress, _dealEndTime);

        deals[newContract].addr = newContract;
        deals[newContract].owner = msg.sender;
        deals[newContract].beneficiary = _beneficiary;
        deals[newContract].dealEndTime = _dealEndTime;
        deals[newContract].index = dealsAddr.push(newContract) - 1;

        return newContract;
    }
}
