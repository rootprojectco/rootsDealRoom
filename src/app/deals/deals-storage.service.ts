import { Injectable } from '@angular/core';
import {DealRoom} from '../deal-room';
import {DealsService} from './deals.service';

@Injectable({
    providedIn: 'root'
})
export class DealsStorageService {
    dealRooms: DealRoom[] = [];
    public dealsByPages: DealRoom[][] = [];

    currentPageIndex = 0;
    countDeals = 0;
    pageSize = 3;

    constructor(
        private dealsService: DealsService
    ) {

    }

    async getDealsForPage() {
        this.dealRooms = this.dealsByPages[this.currentPageIndex];
        if (this.countDeals == 0) {
            this.countDeals = await this.dealsService.getNumDeals();
        }

        let from = this.countDeals - (this.currentPageIndex + 1) * this.pageSize;
        let to = this.countDeals - 1 - (this.currentPageIndex) * this.pageSize;

        if (from < 0) {
            from = 0;
        }

        let dealsForPage = await this.dealsService.getDeals(from, to);
        if (this.dealsByPages[this.currentPageIndex]) {
            this.dealsByPages[this.currentPageIndex].length = 0;
        } else {
            this.dealsByPages[this.currentPageIndex] = [];
        }

        for (const key in dealsForPage) {
            if (dealsForPage.hasOwnProperty(key)) {
                this.dealsByPages[this.currentPageIndex].unshift(dealsForPage[key]);
            }
        }
        this.dealRooms = this.dealsByPages[this.currentPageIndex];
    }
}
