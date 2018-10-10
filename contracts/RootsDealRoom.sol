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

    // Set to true at the end, disallows any change.
    // By defaul initialized to `false`.
    bool public ended = false;

    /**
     * @dev Get returns tokens by bidder address
     */
    mapping(address => uint256) public pendingReturns;

    // Events that will be emitted on changes.
    event BidIncreased(address bidder, uint256 amount);
    event DealEnded(address winner, uint256 amount);
    event LoadEther(address loader, uint256 amount);

    /**
    * @dev Reverts if a safe box is still locked.
    */
    modifier onlyAfterEndTime {
        require(now >= dealEndTime);
        _;
    }

    /**
    * @dev RootsSafeBox constructor
    * @param _beneficiary tokens recipient account address.
    * @param _tokenAddress token address which user could make a deal
    * @param _dealEndTime The amount of time in unix timestamp until deal is active.
    */
    constructor(address _beneficiary, address _tokenAddress, uint256 _dealEndTime) public payable {
        require(_beneficiary != 0x0);
        require(_tokenAddress != 0x0);
        require(_dealEndTime > now);

        beneficiary = _beneficiary;
        tokenAddress = _tokenAddress;
        dealEndTime = _dealEndTime;

        if (msg.value > 0) {
            loadEther();
        }
    }

    /**
    * @dev Standard ERC223 function that will handle incoming token transfers.
    *
    * @param _from  Token sender address.
    * @param _value Amount of tokens.
    * @param _data  Transaction metadata.
    */
    function tokenFallback(address _from, uint256 _value, bytes _data) external returns (bool) {
        require(msg.sender == tokenAddress, "There is not a token for deal.");
        require(now <= dealEndTime, "Deal already ended.");
        require(pendingReturns[_from].add(_value) > highestBid, "There already is a higher bid.");

        uint256 aggregatedValue = pendingReturns[_from].add(_value);

        if (highestBid != 0) {
            pendingReturns[highestBidder] = pendingReturns[highestBidder].add(highestBid);
            pendingReturns[_from] = 0;
        }

        highestBidder = _from;
        highestBid = aggregatedValue;
        emit BidIncreased(_from, _value);

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

        ended = true;
        emit DealEnded(highestBidder, highestBid);

        //transfer ETH to highestBidder
        highestBidder.transfer(balance);

        //transfer highestBid tokens to beneficiary
        ERC20(tokenAddress).transfer(beneficiary, highestBid);
    }

    /**
   * @dev fallback function when contract receive ether
   */
    function () external payable {
        loadEther();
    }

    /**
    * Load ether to the current deal
    */
    function loadEther() public payable {
        require(now <= dealEndTime, "Deal already ended.");
        require(msg.value > 0, "Should send ether.");

        balance = balance.add(msg.value);
        emit LoadEther(msg.sender, msg.value);
    }
}
