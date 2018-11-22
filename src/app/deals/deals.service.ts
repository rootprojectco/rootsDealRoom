import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {DealRoom} from '../deal-room';
import {Web3Service} from '../util/web3.service';
const Web3 = require('web3');

declare let require: any;
const dealsRoomFactory_artifacts = require('../../../build/contracts/RootsDealRoomFactory.json');
const dealsRoom_artifacts = require('../../../build/contracts/RootsDealRoom.json');

@Injectable({
    providedIn: 'root'
})
export class DealsService {
    public deals: { [key: string]: DealRoom } = {};
    public countDeals = 0;
    private DealsRoomFactory: any;

    constructor(
        private web3Service: Web3Service
    ) {

    }

    async setDealsRoomFactory() {
        if (!this.DealsRoomFactory) {
            const DealsRoomFactoryContract: any = await this.getContractPromise(dealsRoomFactory_artifacts);
            this.DealsRoomFactory = await DealsRoomFactoryContract.deployed();
        }
    }

    async getDeals(from, to) {
        await this.setDealsRoomFactory();

        try {
            let dealsReturn = [];
            this.countDeals = await this.DealsRoomFactory.numDeals().valueOf();

            for (let i = from; i <= to; i++) {
                const dealAddress = await this.DealsRoomFactory.dealsAddr(i);
                if (i >= this.countDeals || dealAddress == '0x') {
                    break;
                }

                if (!this.deals[dealAddress]) {
                    let dealAddressContract = await this.getDealRoomContractByAddress(dealAddress);
                    let dealModel = new DealRoom(dealAddress, dealAddressContract);
                    this.updateDealModel(dealAddress, dealModel);
                }

                this.getDealRoomByAddress(dealAddress).then((item) => {
                    this.updateDealModel(dealAddress, item);
                });

                dealsReturn.push(this.deals[dealAddress]);
            }

            return dealsReturn;

        } catch (e) {
            console.log(e);
        }
    }

    async getNumDeals() {
        await this.setDealsRoomFactory();

        try {
            const numDeals = await this.DealsRoomFactory.numDeals();
            return parseInt(numDeals.valueOf());
        } catch (e) {
            console.log(e);
        }
    }

    protected updateDealModel(address: string, dealRoom: DealRoom) {
        if (this.deals[address]) {
            this.deals[address].setParams(dealRoom);
        } else {
            this.deals[address] = dealRoom;
        }
    }

    public async getDeal(address) {
        const self = this;
        if (self.deals[address]) {
            this.updateDealModel(address, self.deals[address]);
            return self.deals[address];
        } else {
            try {
                const dealAddressContract = await this.getDealRoomContractByAddress(address);

                const dealModel = new DealRoom(address, dealAddressContract);
                this.updateDealModel(address, dealModel);

                this.getDealRoomByAddress(address).then((item) => {
                    this.updateDealModel(address, item);
                });

                return this.deals[address];
            } catch (e) {
                throw {error: 'do not found deal room by address - ' + address};
            }
        }
    }

    public async getPendingReturn(addressDealRoom, address) {
        const self = this;
        let pendingReturns = 0;
        const DealRoomContract = await this.getDealRoomContractByAddress(addressDealRoom);

        pendingReturns = this.web3Service.web3.utils.fromWei((await DealRoomContract.pendingReturns(address)).valueOf(), 'ether');
        return pendingReturns;
    }

    public createDeal(beneficiary, dateEnd, amount) {
        this.DealsRoomFactory.create(beneficiary, (dateEnd.getTime() / 1000), { from: this.web3Service.accounts[0] });
    }

    private async getDealRoomByAddress(address) {
        try {
            let DealRoomContract = await this.getDealRoomContractByAddress(address);

            let dealRoom: DealRoom = new DealRoom(address, DealRoomContract);

            dealRoom.balance = this.web3Service.web3.utils.fromWei((await DealRoomContract.balance()).valueOf(), 'ether');
            dealRoom.beneficiary = await DealRoomContract.beneficiary();
            dealRoom.dealEndTime = new Date((await DealRoomContract.dealEndTime()).valueOf() * 1000);
            dealRoom.highestBidder = await DealRoomContract.highestBidder();
            dealRoom.highestBid = this.web3Service.web3.utils.fromWei((await DealRoomContract.highestBid()).valueOf(), 'ether');
            dealRoom.ended = await DealRoomContract.ended();
            dealRoom.loaded = true;

            return dealRoom;
        } catch (error) {
            console.log('ERROR getDealRoomByAddress', error);
            throw error;
        }
    }

    private async getDealRoomContractByAddress(address) {
        let DealRoomAbstractContract: any = await this.getContractPromise(dealsRoom_artifacts);
        let DealRoomContract = await DealRoomAbstractContract.at(address);

        return DealRoomContract;
    }

    public async dealEnd(dealRoom: DealRoom) {
        const self = this;
        const DealRoomContract = await this.getDealRoomContractByAddress(dealRoom.address);

        try {
            await DealRoomContract.dealEnd({from: this.web3Service.accounts[0]});

            return true;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    public async withdraw(dealRoom: DealRoom) {
        const self = this;
        const DealRoomContract = await this.getDealRoomContractByAddress(dealRoom.address);

        try {
            await DealRoomContract.withdraw({from: this.web3Service.accounts[0]});

            return true;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    private getContractPromise(artifacts) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            await self.web3Service.artifactsToContract(artifacts)
                .then((ContractAbstraction) => {
                    resolve(ContractAbstraction);
                });
        });
    }
}
