import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import {DealRoom} from "../deal-room";
import {ActivatedRoute, Router, ParamMap} from "@angular/router";
import {DealsService} from "../deals/deals.service";
import {MatDialog} from "@angular/material";
import {BidDialogComponent} from "./dialogs/bid-dialog.component";
import {Web3Service} from '../util/web3.service';
import {EndDealDialogComponent} from "./dialogs/end-deal-dialog.component";
import {WithdrawDialogComponent} from "./dialogs/withdraw-dialog.component";

@Component({
    selector: 'app-deal-room-details',
    templateUrl: './deal-room-details.component.html',
    styleUrls: ['./deal-room-details.component.less']
})
export class DealRoomDetailsComponent implements OnInit {

    dealRoom: DealRoom;
    account: string;
    pendingReturns = 0;

    constructor(
      private route: ActivatedRoute,
      public dialog: MatDialog,
      private router: Router,
      private dealsService: DealsService,
      private web3Service: Web3Service
    ) { }

    ngOnInit() {

      let self = this;
      const queryParams = this.route.snapshot.queryParams;
      const routeParams = this.route.snapshot.params;

      if (routeParams.address) {
        this.dealsService.getDeal(routeParams.address).then((dealRoom: DealRoom) => {
          self.dealRoom = dealRoom;
        });
      }

        const accountObserver = {
            next: accounts => {
                self.account = accounts[0];
                self.dealsService.getPendingReturn(routeParams.address, self.account).then((pendingR) => {
                    self.pendingReturns = pendingR;
                });
            },
            error: err => {
                console.error('Observer got an error: ' + err);
                },
            complete: () => {
                console.log('Observer got a complete notification');
                },
        };

      this.web3Service.accountsObservable._subscribe(accountObserver);
    }

    openBidDialog() {
        const dialogRef = this.dialog.open(BidDialogComponent, {
            width: '250px',
            data: {dealRoom: this.dealRoom}
        });

        dialogRef.afterClosed().subscribe(this.proccessAfterDialogClose.bind(this));
    }

    openEndDealDialog() {
        const dialogRef = this.dialog.open(EndDealDialogComponent, {
            width: '250px',
            data: {dealRoom: this.dealRoom}
        });

        dialogRef.afterClosed().subscribe(this.proccessAfterDialogClose.bind(this));
    }

    openWithdrawDialog() {
        const dialogRef = this.dialog.open(WithdrawDialogComponent, {
            width: '250px',
            data: {dealRoom: this.dealRoom}
        });

        dialogRef.afterClosed().subscribe(this.proccessAfterDialogClose.bind(this));
    }

    proccessAfterDialogClose(result) {
        let self = this;
        console.log('The dialog was closed', result);

        if (result == 'update') {
            this.dealsService.getDeal(this.dealRoom.address).then((dealRoom: DealRoom) => {
                self.dealRoom = dealRoom;
            });
        }
    }

    isDateTimeEnd(dateTime) {
        let currentDateTime = new Date();
        return dateTime < currentDateTime;
    }

    update() {
        let self = this;
        const routeParams = this.route.snapshot.params;
        if (routeParams.address) {
            self.dealRoom.dealEndTime = undefined;
            this.dealsService.reloadDealRoom(routeParams.address).then(async (dealRoom: DealRoom) => {
                await self.dealRoom = dealRoom;
            });
        }
    }
}
