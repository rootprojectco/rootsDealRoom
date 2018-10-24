import { Component, OnInit } from '@angular/core';
import {DealRoom} from "../deal-room";

@Component({
    selector: 'app-deal-room-details',
    templateUrl: './deal-room-details.component.html',
    styleUrls: ['./deal-room-details.component.less']
})
export class DealRoomDetailsComponent implements OnInit {

    dealRoom: DealRoom;

    constructor() { }

    ngOnInit() {
        this.dealRoom = {
            address: "0x012345678911122",
            beneficiary: "0x0123456789111",
            dealEndTime: new Date(),
            balance: "3.5",
            highestBidder: "0x0123456789666",
            highestBid: "1800",
            ended: true
        };
    }

}
