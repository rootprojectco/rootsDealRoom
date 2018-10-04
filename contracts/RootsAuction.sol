pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

// This is Auction contract for RootsProject.co

contract RootsAuction is Ownable {
    using SafeMath for uint256;

    // address who receive all tokens from this smart contract after close time
    address public beneficiary;

    // address of token smart contract
    address public tokenAddress;

    // timestamp until auction is active
    uint256 public auctionEndTime;

    // balance in ETH
    uint256 public balance;

    // Current state of the auction.
    address public highestBidder;
    uint256 public highestBid;

    // Allowed withdrawals of previous bids
    mapping(address => uint256) pendingReturns;

    // Set to true at the end, disallows any change.
    // By defaul initialized to `false`.
    bool ended = false;

    // Events that will be emitted on changes.
    event BidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    /**
    * @dev Reverts if a safe box is still locked.
    */
    modifier onlyAfterEndTime {
        require(now >= auctionEndTime);
        _;
    }

    /**
    * @dev RootsSafeBox constructor
    * @param _destinationAddress recipient account address.
    * @param _defaultTokenAddress defaul token address for withdraw
    * @param _safeTime The amount of time in unix timestamp until safe box is closed.
    * @param _owner Owner account address.
    */
    constructor(address _beneficiary, address _tokenAddress, uint256 _auctionEndTime) public payable {
        require(_beneficiary != 0x0);
        require(_tokenAddress != 0x0);
        require(_auctionEndTime > now);

        require(msg.value > 0);

        beneficiary = _beneficiary;
        tokenAddress = _tokenAddress;
        auctionEndTime = _auctionEndTime;

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
        require(msg.sender == tokenAddress, "There is not a token for auction.");
        require(now <= auctionEndTime, "Auction already ended.");
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
    * End the auction and send the highest bid to the beneficiary and ETH to highestBidder
    */
    function auctionEnd() public {
        require(now >= auctionEndTime, "Auction not yet ended.");
        require(!ended, "auctionEnd has already been called.");

        // 2. Effects
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        //transfer ETH to highestBidder
        highestBidder.transfer(balance);

        //transfer highestBid tokens to beneficiary
        ERC20(tokenAddress).transfer(beneficiary, highestBid);
    }
}
