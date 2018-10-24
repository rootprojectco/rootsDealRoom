import { Component, OnInit } from '@angular/core';
import {DealRoom} from "../deal-room";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

    constructor() { }

    title = 'List of Deal rooms!';

    dealRooms: DealRoom[] = [];

    ngOnInit() {
        this.dealRooms = [{
            address: "0x012345678900011",
            beneficiary: "0x0123456789000",
            dealEndTime: new Date(),
            balance: "0.15",
            highestBidder: "0x0123456789555",
            highestBid: "150",
            ended: false
        }, {
            address: "0x012345678911122",
            beneficiary: "0x0123456789111",
            dealEndTime: new Date(),
            balance: "3.5",
            highestBidder: "0x0123456789666",
            highestBid: "1800",
            ended: true
        }];
    }
}
