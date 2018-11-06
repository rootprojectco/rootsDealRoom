export class DealRoom {
  contract: any;
  address: string;

  beneficiary?: string;
  dealEndTime?: Date;
  balance?: string;
  highestBidder?: string;
  highestBid?: string;
  ended?: boolean;
  loaded?: boolean;

  constructor(address, DealRoomContract) {
    this.address = address;
    this.contract = DealRoomContract;
  }

  public setParams(params) {
    this.contract = params.contract;
    this.address = params.address;
    this.beneficiary = params.beneficiary;
    this.dealEndTime = params.dealEndTime;
    this.balance = params.balance;
    this.highestBidder = params.highestBidder;
    this.highestBid = params.highestBid;
    this.ended = params.ended;
    this.loaded = params.loaded;
  }
}
