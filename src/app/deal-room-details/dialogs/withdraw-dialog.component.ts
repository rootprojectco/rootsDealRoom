import {Component, Inject} from '@angular/core';
import {DealRoom} from './../../deal-room';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DealsService} from '../../deals/deals.service';

@Component({
    selector: 'app-withdraw-dialog',
    templateUrl: 'withdraw-dialog.component.html',
})
export class WithdrawDialogComponent {

    error: string;

    constructor(
        private dealService: DealsService,
        public dialogRef: MatDialogRef<WithdrawDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {dealRoom: DealRoom}
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(): void {
        this.dealService.withdraw(this.data.dealRoom).then((value) => {
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
