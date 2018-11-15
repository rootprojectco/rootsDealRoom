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

    issetNew = false;

    private checkNewInterval = undefined;

    constructor(
        private dealsService: DealsService
    ) {

    }

    async getDealsForPage() {
        console.log("getDealsForPage", this.currentPageIndex);
        this.dealRooms = this.dealsByPages[this.currentPageIndex];
        if (this.countDeals == 0) {
            this.issetNew = false;
            this.countDeals = await this.dealsService.getNumDeals();
        }
        this.setCurrentCountDealInterval();

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

    async checkCurrentCountDeals() {
        let currentCountDeals = await this.dealsService.getNumDeals();
        if (currentCountDeals !== this.countDeals) {
            this.issetNew = true;
        }
    }

    setCurrentCountDealInterval() {
        if (!this.checkNewInterval) {
            this.checkNewInterval = setInterval(() => {
                this.checkCurrentCountDeals();
            }, 3000);
        }
        this.checkCurrentCountDeals();
    }
}
