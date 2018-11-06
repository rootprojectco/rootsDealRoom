import {Component, Input, OnInit} from '@angular/core';
import {DealRoom} from "../deal-room";
import {Router} from "@angular/router";

@Component({
    selector: 'app-deal-room-card',
    templateUrl: './deal-room-card.component.html',
    styleUrls: ['./deal-room-card.component.less']
})
export class DealRoomCardComponent implements OnInit {

    @Input() dealRoom: DealRoom;

    constructor(
        private router: Router
    ) { }

    ngOnInit() {

    }



    open(dealRoom) {
        if (dealRoom.loaded) {
            this.router.navigate(['/address/' + dealRoom.address]);
        }
    }
}
