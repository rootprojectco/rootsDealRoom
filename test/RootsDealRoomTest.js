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
        await tokenInstance.mint(account1, 1000);
        await tokenInstance.mint(account2, 1000);
        await tokenInstance.mint(account3, 1000);
    });

    it("should create deal for " + DEAL_ROOM_OPEN_IN_SECONDS + " seconds", async () => {
        let deployParams = [
            beneficiary,
            tokenInstance.address,
            dateCloseDealRoom
        ];
        dealRoomInstance = await RootsDealRoom.new.apply(this, deployParams, {value: 1});

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

    it("should make bid (100) from account1", async () => {
        tokenInstance.transfer(dealRoomInstance.address, 100, {from: account1});

        let _balanceAccount1 = await tokenInstance.balanceOf(account1);
        assert.equal(_balanceAccount1.valueOf(), 900);

        let _balanceDealRoom = await tokenInstance.balanceOf(dealRoomInstance.address);
        assert.equal(_balanceDealRoom.valueOf(), 100);

        let _highestBidder = await dealRoomInstance.highestBidder();
        assert.equal(_highestBidder, account1);

        let _highestBid = await dealRoomInstance.highestBid();
        assert.equal(_highestBid.valueOf(), 100);

        let _pendingReturns = await dealRoomInstance.pendingReturns(account1);
        assert.equal(_pendingReturns.valueOf(), 0);
    });

    it("should not make small bid (50) from account2", async () => {
        let error1;

        try {
            let tx = await tokenInstance.transfer(dealRoomInstance.address, 50, {from: account2});
        } catch (e) {
            error1 = e;
        }

        assert.isDefined(error1);

        let _balanceAccount2 = await tokenInstance.balanceOf(account2);
        assert.equal(_balanceAccount2.valueOf(), 1000);

        let _balanceDealRoom = await tokenInstance.balanceOf(dealRoomInstance.address);
        assert.equal(_balanceDealRoom.valueOf(), 100);

        let _highestBidder = await dealRoomInstance.highestBidder();
        assert.equal(_highestBidder, account1);

        let _highestBid = await dealRoomInstance.highestBid();
        assert.equal(_highestBid.valueOf(), 100);

        let _pendingReturns = await dealRoomInstance.pendingReturns(account2);
        assert.equal(_pendingReturns.valueOf(), 0);
    });

    it("should make bid (200) from account3", async () => {
        tokenInstance.transfer(dealRoomInstance.address, 200, {from: account3});

        let _balanceAccount3 = await tokenInstance.balanceOf(account3);
        assert.equal(_balanceAccount3.valueOf(), 800);

        let _balanceDealRoom = await tokenInstance.balanceOf(dealRoomInstance.address);
        assert.equal(_balanceDealRoom.valueOf(), 300);

        let _highestBidder = await dealRoomInstance.highestBidder();
        assert.equal(_highestBidder, account3);

        let _highestBid = await dealRoomInstance.highestBid();
        assert.equal(_highestBid.valueOf(), 200);

        let _pendingReturnsAccount1 = await dealRoomInstance.pendingReturns(account1);
        assert.equal(_pendingReturnsAccount1.valueOf(), 100);

        let _pendingReturnsAccount2 = await dealRoomInstance.pendingReturns(account2);
        assert.equal(_pendingReturnsAccount2.valueOf(), 0);

        let _pendingReturnsAccount3 = await dealRoomInstance.pendingReturns(account3);
        assert.equal(_pendingReturnsAccount3.valueOf(), 0);
    });

    it("should not make small bids (50 and 100) from account1", async () => {
        let error1;
        try {
            await tokenInstance.transfer(dealRoomInstance.address, 50, {from: account1});
        } catch (e) {
            error1 = e;
        }
        assert.isDefined(error1);

        let error2;
        try {
            await tokenInstance.transfer(dealRoomInstance.address, 100, {from: account1});
        } catch (e) {
            error2 = e;
        }
        assert.isDefined(error2);
    });

    it("should make bid (120) from account1", async () => {
        tokenInstance.transfer(dealRoomInstance.address, 120, {from: account1});

        let _balanceAccount1 = await tokenInstance.balanceOf(account1);
        assert.equal(_balanceAccount1.valueOf(), 780);

        let _balanceDealRoom = await tokenInstance.balanceOf(dealRoomInstance.address);
        assert.equal(_balanceDealRoom.valueOf(), 420);

        let _highestBidder = await dealRoomInstance.highestBidder();
        assert.equal(_highestBidder, account1);

        let _highestBid = await dealRoomInstance.highestBid();
        assert.equal(_highestBid.valueOf(), 220);

        let _pendingReturnsAccount1 = await dealRoomInstance.pendingReturns(account1);
        assert.equal(_pendingReturnsAccount1.valueOf(), 0);

        let _pendingReturnsAccount2 = await dealRoomInstance.pendingReturns(account2);
        assert.equal(_pendingReturnsAccount2.valueOf(), 0);

        let _pendingReturnsAccount3 = await dealRoomInstance.pendingReturns(account3);
        assert.equal(_pendingReturnsAccount3.valueOf(), 200);
    });

    it("should make bid (250) from account2", async () => {
        tokenInstance.transfer(dealRoomInstance.address, 250, {from: account2});

        let _balanceAccount1 = await tokenInstance.balanceOf(account1);
        assert.equal(_balanceAccount1.valueOf(), 780);

        let _balanceAccount2 = await tokenInstance.balanceOf(account2);
        assert.equal(_balanceAccount2.valueOf(), 750);

        let _balanceDealRoom = await tokenInstance.balanceOf(dealRoomInstance.address);
        assert.equal(_balanceDealRoom.valueOf(), 670);

        let _highestBidder = await dealRoomInstance.highestBidder();
        assert.equal(_highestBidder, account2);

        let _highestBid = await dealRoomInstance.highestBid();
        assert.equal(_highestBid.valueOf(), 250);

        let _pendingReturnsAccount1 = await dealRoomInstance.pendingReturns(account1);
        assert.equal(_pendingReturnsAccount1.valueOf(), 220);

        let _pendingReturnsAccount2 = await dealRoomInstance.pendingReturns(account2);
        assert.equal(_pendingReturnsAccount2.valueOf(), 0);

        let _pendingReturnsAccount3 = await dealRoomInstance.pendingReturns(account3);
        assert.equal(_pendingReturnsAccount3.valueOf(), 200);
    });

    it("should not withdraw tokens from account2", async () => {
        let error1;
        try {
            await dealRoomInstance.withdraw({from: account2});
        } catch (e) {
            error1 = e;
        }
        assert.isDefined(error1);
    });

    it("should withdraw tokens from account3", async () => {
        await dealRoomInstance.withdraw({from: account3});

        let _balanceAccount3 = await tokenInstance.balanceOf(account3);
        assert.equal(_balanceAccount3.valueOf(), 1000);

        let _balanceDealRoom = await tokenInstance.balanceOf(dealRoomInstance.address);
        assert.equal(_balanceDealRoom.valueOf(), 470);

        let _pendingReturnsAccount3 = await dealRoomInstance.pendingReturns(account3);
        assert.equal(_pendingReturnsAccount3.valueOf(), 0);
    });

    it("should not withdraw tokens from account3", async () => {
        let error1;
        try {
            await dealRoomInstance.withdraw({from: account3});
        } catch (e) {
            error1 = e;
        }
        assert.isDefined(error1);
    });

    it("should end deal after " + DEAL_ROOM_OPEN_IN_SECONDS + " seconds", async () => {
        let etherBalanceAccount2Before = web3.eth.getBalance(account2);

        await new Promise(resolve => setTimeout(resolve, DEAL_ROOM_OPEN_IN_SECONDS*1000));

        await dealRoomInstance.dealEnd({from: account1});

        let _balanceAccount1 = await tokenInstance.balanceOf(account1);
        assert.equal(_balanceAccount1.valueOf(), 780);

        let _balanceAccount2 = await tokenInstance.balanceOf(account2);
        assert.equal(_balanceAccount2.valueOf(), 750);

        let _balanceBeneficiary = await tokenInstance.balanceOf(beneficiary);
        assert.equal(_balanceBeneficiary.valueOf(), 250);

        let etherBalanceAccount2 = web3.eth.getBalance(account2);
        assert.equal(etherBalanceAccount2.valueOf() - etherBalanceAccount2Before.valueOf(), web3.toWei('3', 'ether'));

        let _balanceDealRoom = await tokenInstance.balanceOf(dealRoomInstance.address);
        assert.equal(_balanceDealRoom.valueOf(), 220);

        let _highestBidder = await dealRoomInstance.highestBidder();
        assert.equal(_highestBidder, account2);

        let _highestBid = await dealRoomInstance.highestBid();
        assert.equal(_highestBid.valueOf(), 250);

        let _pendingReturnsAccount1 = await dealRoomInstance.pendingReturns(account1);
        assert.equal(_pendingReturnsAccount1.valueOf(), 220);

        let _pendingReturnsAccount2 = await dealRoomInstance.pendingReturns(account2);
        assert.equal(_pendingReturnsAccount2.valueOf(), 0);

        let _pendingReturnsAccount3 = await dealRoomInstance.pendingReturns(account3);
        assert.equal(_pendingReturnsAccount3.valueOf(), 0);
    });

    it("should withdraw tokens from account1", async () => {
        await dealRoomInstance.withdraw({from: account1});

        let _balanceAccount1 = await tokenInstance.balanceOf(account1);
        assert.equal(_balanceAccount1.valueOf(), 1000);

        let _balanceDealRoom = await tokenInstance.balanceOf(dealRoomInstance.address);
        assert.equal(_balanceDealRoom.valueOf(), 0, "Wrong balance at deal room");

        let _pendingReturnsAccount1 = await dealRoomInstance.pendingReturns(account1);
        assert.equal(_pendingReturnsAccount1.valueOf(), 0);

        let _pendingReturnsAccount2 = await dealRoomInstance.pendingReturns(account2);
        assert.equal(_pendingReturnsAccount2.valueOf(), 0);

        let _pendingReturnsAccount3 = await dealRoomInstance.pendingReturns(account3);
        assert.equal(_pendingReturnsAccount3.valueOf(), 0);
    });
});
