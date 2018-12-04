pragma solidity ^0.4.24;

// File: openzeppelin-solidity/contracts/math/SafeMath.sol

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (_a == 0) {
      return 0;
    }

    c = _a * _b;
    assert(c / _a == _b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
    // assert(_b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = _a / _b;
    // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold
    return _a / _b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
    assert(_b <= _a);
    return _a - _b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    c = _a + _b;
    assert(c >= _a);
    return c;
  }
}

// File: openzeppelin-solidity/contracts/ownership/Ownable.sol

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}

// File: openzeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * See https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address _who) public view returns (uint256);
  function transfer(address _to, uint256 _value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

// File: openzeppelin-solidity/contracts/token/ERC20/ERC20.sol

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
  function allowance(address _owner, address _spender)
    public view returns (uint256);

  function transferFrom(address _from, address _to, uint256 _value)
    public returns (bool);

  function approve(address _spender, uint256 _value) public returns (bool);
  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );
}

// File: contracts/RootsDealRoom.sol

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

        uint256 aggregatedValue = pendingReturns[_from].add(_value);

        if (highestBidder == _from) {
            aggregatedValue = highestBid.add(_value);
        } else {
            require(pendingReturns[_from].add(_value) > highestBid, "There already is a higher bid.");
        }

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
        require(amount > 0);

        pendingReturns[_bidder] = 0;

        if (!ERC20(tokenAddress).transfer(_bidder, amount)) {
            pendingReturns[_bidder] = amount;
            return false;
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

        if (highestBid > 0) {
            //transfer ETH to highestBidder
            highestBidder.transfer(balance);

            //transfer highestBid tokens to beneficiary
            ERC20(tokenAddress).transfer(beneficiary, highestBid);
        } else {
            //return ETH to owner
            owner.transfer(balance);
        }
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
