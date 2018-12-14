import {Component, Inject} from '@angular/core';
import {DealRoom} from './../../deal-room';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TokenService} from './../../deals/token.service';

@Component({
    selector: 'app-bid-dialog',
    templateUrl: 'bid-dialog.component.html',
})
export class BidDialogComponent {

    bid = '';
    error: string;

    constructor(
        private tokenService: TokenService,
        public dialogRef: MatDialogRef<BidDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {dealRoom: DealRoom}
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(): void {
        this.tokenService.send(this.data.dealRoom.address, this.bid).then((value) => {
            console.log('OK', value);
            if (value) {
                this.dialogRef.close('update');
            }
        }, (error) => {
            console.log('ERROR', error);
            this.error = error.message;
        });
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }
}
