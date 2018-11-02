import { Component, OnInit } from '@angular/core';
import {DealRoom} from "../deal-room";
import {DealsService} from "../deals/deals.service";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

    constructor(
      private dealsService: DealsService
    ) { }

    title = 'List of Deal rooms!';

    dealRooms: { [key: string]: DealRoom } = {};
    currentPage: number = 1;

    async ngOnInit() {

      this.dealRooms = this.dealsService.deals;
      await this.dealsService.getDeals(1);

    }

    extractDeals() {
      let returnArray = [];
      for(var address in this.dealRooms) {
        returnArray.push(this.dealRooms[address]);
      }

      return returnArray;
    }
}
