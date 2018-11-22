import {Component, Inject} from '@angular/core';
import {DealRoom} from './../../deal-room';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DealsService} from "../../deals/deals.service";

@Component({
    selector: 'app-end-deal-dialog',
    templateUrl: 'end-deal-dialog.component.html',
})
export class EndDealDialogComponent {

    error: string;

    constructor(
        private dealService: DealsService,
        public dialogRef: MatDialogRef<EndDealDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {dealRoom: DealRoom}
    ) {}

    onNoClick(): void {
        this.dialogRef.close('close');
    }

    async onYesClick(): void {
        this.dealService.dealEnd(this.data.dealRoom).then((value) => {
            console.log("OK", value);
            if (value) {
                this.dialogRef.close('update');
            }
        }, (error) => {
            console.log("ERROR", error);
            this.error = error.message;
        });
    }

    onCloseClick(): void {
        this.dialogRef.close('close');
    }
}
