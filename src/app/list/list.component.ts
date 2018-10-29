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

    dealRooms: DealRoom[] = [];
    currentPage: number = 1;

    async ngOnInit() {

      this.dealsService.deals.length = 0;

      this.dealRooms = this.dealsService.deals;
      await this.dealsService.getDeals(1);

    }
}
