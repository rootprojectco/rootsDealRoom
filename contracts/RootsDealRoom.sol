pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

// This is DealRoom contract for RootsProject.co

contract RootsDealRoom is Ownable {
    using SafeMath for uint256;

    // address who receive all tokens from this smart contract after close time
    address public beneficiary;

    // address of token smart contract
    address public tokenAddress;

    // timestamp until deal is active
    uint256 public dealEndTime;

    // balance in ETH
    uint256 public balance;

    // Current state of the deal.
    address public highestBidder;
    uint256 public highestBid;

    // Allowed withdrawals of previous bids
    mapping(address => uint256) pendingReturns;

    // Set to true at the end, disallows any change.
    // By defaul initialized to `false`.
    bool ended = false;

    // ---====== Pending returns ======---
    /**
     * @dev Get returns tokens by bidder address
     */
    mapping(address => uint256) public pendingReturns;

    /**
     * @dev Contracts addresses list
     */
    address[] public pendingReturnsAddr;

    /**
     * @dev Count of contracts in list
     */
    function numPendingReturns() public view returns (uint256)
    { return boxesAddr.length; }

    // Events that will be emitted on changes.
    event BidIncreased(address bidder, uint256 amount);
    event DealEnded(address winner, uint256 amount);

    /**
    * @dev Reverts if a safe box is still locked.
    */
    modifier onlyAfterEndTime {
        require(now >= dealEndTime);
        _;
    }

    /**
    * @dev RootsSafeBox constructor
    * @param _destinationAddress recipient account address.
    * @param _defaultTokenAddress defaul token address for withdraw
    * @param _safeTime The amount of time in unix timestamp until safe box is closed.
    * @param _owner Owner account address.
    */
    constructor(address _beneficiary, address _tokenAddress, uint256 _dealEndTime) public payable {
        require(_beneficiary != 0x0);
        require(_tokenAddress != 0x0);
        require(_dealEndTime > now);

        require(msg.value > 0);

        beneficiary = _beneficiary;
        tokenAddress = _tokenAddress;
        dealEndTime = _dealEndTime;

        balance = msg.value;
    }

    /**
    * @dev Standard ERC223 function that will handle incoming token transfers.
    *
    * @param _from  Token sender address.
    * @param _value Amount of tokens.
    * @param _data  Transaction metadata.
    */
    function tokenFallback(address _from, uint _value, bytes _data) external returns (bool) {
        require(msg.sender == tokenAddress, "There is not a token for deal.");
        require(now <= dealEndTime, "Deal already ended.");
        require(_value > highestBid, "There already is a higher bid.");

        if (highestBid != 0) {
            pendingReturns[highestBidder].add(highestBid);
        }

        highestBidder = _from;
        highestBid = _value;
        emit HighestBidIncreased(_from, _value);

        return true;
    }

    /**
    * Withdraw a bid that was overbid (call by owner of tokens).
    */
    function withdraw() public returns (bool) {
        return baseWithdrawToken(msg.sender);
    }

    /**
    * Withdraw a bid that was overbid (call by anybody).
    */
    function withdraw(address _bidder) public returns (bool) {
        require(now >= dealEndTime, "Deal not yet ended.");

        return baseWithdrawToken(_bidder);
    }

    /**
    * Base function for withdraw tokens.
    */
    function baseWithdrawToken(address _bidder) internal returns (bool) {
        uint amount = pendingReturns[_bidder];
        if (amount > 0) {
            pendingReturns[_bidder] = 0;

            if (!ERC20(tokenAddress).transfer(_bidder, amount)) {
                // No need to call throw here, just reset the amount owing
                pendingReturns[_bidder] = amount;
                return false;
            }
        }
        return true;
    }

    /**
    * End the deal and send the highest bid to the beneficiary and ETH to highestBidder
    */
    function dealEnd() public {
        require(now >= dealEndTime, "Deal not yet ended.");
        require(!ended, "dealEnd has already been called.");

        // 2. Effects
        ended = true;
        emit DealEnded(highestBidder, highestBid);

        //transfer ETH to highestBidder
        highestBidder.transfer(balance);

        //transfer highestBid tokens to beneficiary
        ERC20(tokenAddress).transfer(beneficiary, highestBid);
    }
}
