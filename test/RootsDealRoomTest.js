const RootsToken = artifacts.require("RootsToken");
const RootsDealRoom = artifacts.require("RootsDealRoom");

const truffleAssert = require('truffle-assertions');

contract('RootsDealRoom test', async (accounts) => {

    let DEAL_ROOM_OPEN_IN_SECONDS = 10;

    let owner = accounts[0];
    let beneficiary = accounts[1];
    let account1 = accounts[2];
    let account2 = accounts[3];
    let account3 = accounts[4];
    let tokenInstance;
    let dealRoomInstance;

    let dateCloseDealRoom = Date.now()/1000 + DEAL_ROOM_OPEN_IN_SECONDS;

    before(async () => {
        tokenInstance = await RootsToken.new.apply(this);

        let deployParams = [
            beneficiary,
            tokenInstance.address,
            dateCloseDealRoom
        ];
        dealRoomInstance = await RootsDealRoom.new.apply(this, deployParams, {value: 1});
    });

    it("should check initial params", async () => {
        let _beneficiary = await dealRoomInstance.beneficiary();
        let _tokenAddress = await dealRoomInstance.tokenAddress();
        let _dealEndTime = await dealRoomInstance.dealEndTime();
        let _balance = await dealRoomInstance.balance();

        let _highestBidder = await dealRoomInstance.highestBidder();
        let _highestBid = await dealRoomInstance.highestBid();

        let _ended = await dealRoomInstance.ended();

        assert.equal(_beneficiary.valueOf(), beneficiary);
        assert.equal(_tokenAddress, tokenInstance.address);
        assert.equal(_dealEndTime.valueOf(), Math.floor(dateCloseDealRoom));
        assert.equal(_balance.valueOf(), 0);
        assert.equal(_highestBidder.valueOf(), 0);
        assert.equal(_highestBid.valueOf(), 0);
        assert.equal(_ended.valueOf(), false);
    });

    it("should load ether to DealRoom", async () => {

        let tx = await dealRoomInstance.sendTransaction({
            from: account1,
            value: web3.toWei('3', 'ether'),
        });

        truffleAssert.eventEmitted(tx, 'LoadEther', (ev) => {
            return ev.loader == account1 && ev.amount.valueOf() == web3.toWei('3', 'ether');
        });

        let _balance = await dealRoomInstance.balance();

        assert.equal(_balance.valueOf(), web3.toWei('3', 'ether'));
    });

    it("should not end deal when the deal is open", async () => {
        let error1;

        try {
            await dealRoomInstance.dealEnd({from: account1});
        } catch (e) {
            error1 = e;
        }

        assert.isDefined(error1);
    });
});
