import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import {DealRoom} from "../deal-room";
import {ActivatedRoute, Router, ParamMap} from "@angular/router";
import {DealsService} from "../deals/deals.service";
import {MatDialog} from "@angular/material";
import {BidDialogComponent} from "./bid-dialog.component";

@Component({
    selector: 'app-deal-room-details',
    templateUrl: './deal-room-details.component.html',
    styleUrls: ['./deal-room-details.component.less']
})
export class DealRoomDetailsComponent implements OnInit {

    dealRoom: DealRoom;

    constructor(
      private route: ActivatedRoute,
      public dialog: MatDialog,
      private router: Router,
      private dealsService: DealsService
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
}
