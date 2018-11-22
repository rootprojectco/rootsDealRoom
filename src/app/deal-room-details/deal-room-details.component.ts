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

        const myObserver = {
            next: x => {
                self.account = x[0];
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

      this.web3Service.accountsObservable._subscribe(myObserver);

      // this.account = this.web3Service.accounts[0];
      // this.pendingReturns = this.dealsService.getPendingReturn(this.account).then((pendingR) => {
      //     self.pendingReturns = pendingR;
      // });
    }

    openBidDialog() {
        const dialogRef = this.dialog.open(BidDialogComponent, {
            width: '250px',
            data: {dealRoom: this.dealRoom}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
        });
    }

    openEndDealDialog() {
        const dialogRef = this.dialog.open(EndDealDialogComponent, {
            width: '250px',
            data: {dealRoom: this.dealRoom}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
        });
    }

    openWithdrawDialog() {
        const dialogRef = this.dialog.open(WithdrawDialogComponent, {
            width: '250px',
            data: {dealRoom: this.dealRoom}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed', result);
        });
    }

    isDateTimeEnd(dateTime) {
        let currentDateTime = new Date();
        return dateTime < currentDateTime;
    }
}
