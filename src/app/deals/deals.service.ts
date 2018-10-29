import { Injectable } from '@angular/core';
import {DealRoom} from "../deal-room";
import {Web3Service} from "../util/web3.service";
const Web3 = require('web3');

declare let require: any;
const dealsRoomFactory_artifacts = require('../../../build/contracts/RootsDealRoomFactory.json');
const dealsRoom_artifacts = require('../../../build/contracts/RootsDealRoom.json');

@Injectable({
  providedIn: 'root'
})
export class DealsService {
  public deals: DealRoom[] = [];
  private DealsRoomFactory: any;

  private itemsPerPage: number = 10;

  constructor(
      private web3Service: Web3Service
  ) {

  }

  async setDealsRoomFactory() {
    if (!this.DealsRoomFactory) {
      console.log("IF");
      let DealsRoomFactoryContract: any = await this.getContractPromise(dealsRoomFactory_artifacts);
      this.DealsRoomFactory = await DealsRoomFactoryContract.deployed();
    }
  }

  async getDeals(page) {
    await this.setDealsRoomFactory();

    try {
      let numDeals = await this.DealsRoomFactory.numDeals().valueOf();

      let from = (page-1) * this.itemsPerPage;
      let to = page * this.itemsPerPage;

      for (let i = from; i < to; i++) {
        let dealAddress = await this.DealsRoomFactory.dealsAddr(i);
        if (i >= numDeals || dealAddress == '0x') {
          break;
        }
        this.deals.push(await this.getDealRoomByAddress(dealAddress));

      }

      return true;

    } catch (e) {
      console.log(e);
    }
  }

  private async getDealRoomByAddress(address) {
    let DealRoomAbstractContract: any = await this.getContractPromise(dealsRoom_artifacts);
    let DealRoomContract = await DealRoomAbstractContract.at(address);

    let dealRoom: DealRoom = {
      address: address,
      contract: DealRoomContract
    };
    dealRoom.balance = this.web3Service.web3.utils.fromWei((await DealRoomContract.balance()).valueOf(), 'ether');
    dealRoom.beneficiary = await DealRoomContract.beneficiary();
    dealRoom.dealEndTime = new Date((await DealRoomContract.dealEndTime()).valueOf() * 1000);
    dealRoom.highestBidder = await DealRoomContract.highestBidder();
    dealRoom.highestBid = this.web3Service.web3.utils.fromWei((await DealRoomContract.highestBid()).valueOf(), 'ether');
    dealRoom.ended = await DealRoomContract.ended();

    console.log("NEW dealRoom", dealRoom);

    return dealRoom;
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
