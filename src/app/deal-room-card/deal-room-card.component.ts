import {Component, Input, OnInit} from '@angular/core';
import {DealRoom} from "../deal-room";

@Component({
    selector: 'app-deal-room-card',
    templateUrl: './deal-room-card.component.html',
    styleUrls: ['./deal-room-card.component.less']
})
export class DealRoomCardComponent implements OnInit {

    @Input() dealRoom: DealRoom;

    constructor() { }

    ngOnInit() {
    }

}
