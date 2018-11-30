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

    loading = true;

    pageEvent: PageEvent;

    async ngOnInit() {
        this.loading = true;
        await this.dealsStorage.getDealsForPage();
        this.loading = false;
    }

    async changePage(e: any) {
        this.dealsStorage.currentPageIndex = e.pageIndex;
        if (!this.dealsStorage.dealsByPages[this.dealsStorage.currentPageIndex]) {
            this.loading = true;
        }
        await this.dealsStorage.getDealsForPage();
        this.loading = false;
    }

    public async updateList() {
        this.loading = true;
        this.dealsStorage.countDeals = 0;
        this.dealsStorage.currentPageIndex = 0;
        this.dealsStorage.dealRooms.length = 0;
        this.dealsStorage.dealsByPages.length = 0;
        await this.dealsStorage.getDealsForPage();
        this.loading = false;
    }
}
