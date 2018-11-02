import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import {DealRoom} from "../deal-room";
import {ActivatedRoute, Router, ParamMap} from "@angular/router";
import {DealsService} from "../deals/deals.service";

@Component({
    selector: 'app-deal-room-details',
    templateUrl: './deal-room-details.component.html',
    styleUrls: ['./deal-room-details.component.less']
})
export class DealRoomDetailsComponent implements OnInit {

    dealRoom: DealRoom;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private dealsService: DealsService
    ) { }

    ngOnInit() {

      let self = this;
      const queryParams = this.route.snapshot.queryParams;
      const routeParams = this.route.snapshot.params;
console.log("ROUTER", queryParams, routeParams);

      if (routeParams.address) {
        this.dealsService.getDeal(routeParams.address).then((dealRoom: DealRoom) => {
          self.dealRoom = dealRoom;
        });
      }

      // this.dealRoom = this.route.paramMap.pipe(
      //   switchMap((params: ParamMap) =>
      //     this.dealsService.getDeal(params.get('address')))
      // );
      //   this.dealRoom = {
      //     contract: "",
      //       address: "0x012345678911122",
      //       beneficiary: "0x0123456789111",
      //       dealEndTime: new Date(),
      //       balance: "3.5",
      //       highestBidder: "0x0123456789666",
      //       highestBid: "1800",
      //       ended: true
      //   };
    }

}
