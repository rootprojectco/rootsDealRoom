import {Component, Inject} from '@angular/core';
import {DealRoom} from "../deal-room";
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-bid-dialog',
    templateUrl: 'bid-dialog.component.html',
})
export class BidDialogComponent {

    bid: string;

    constructor(
        public dialogRef: MatDialogRef<BidDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {dealRoom: DealRoom}
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
