import { Component, OnInit } from '@angular/core';
import {DealRoom} from "../deal-room";
import {DealsService} from "../deals/deals.service";
import {PageEvent} from "@angular/material";
import {DealsStorageService} from "../deals/deals-storage.service";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {

    constructor(
        private dealsService: DealsService,
        public dealsStorage: DealsStorageService
    ) { }

    currentPageIndex = 0;
    countDeals = 0;
    pageSize = 30;
    loading = true;

    pageEvent: PageEvent;

    async ngOnInit() {

        this.countDeals = this.dealsStorage.countDeals;
        this.currentPageIndex = this.dealsStorage.currentPageIndex;
        this.pageSize = this.dealsStorage.pageSize;

        this.loading = true;
        await this.dealsStorage.getDealsForPage();
        this.loading = false;
    }

    getDeals() {
        return this.dealsStorage.dealRooms;
    }

    changePage(e: any) {
        console.log('PAGE CHANGE', e);
    }
}
