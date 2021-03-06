import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule, MatDatepickerModule, MatDialogModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule, MatNativeDateModule, MatPaginatorModule,
    MatProgressSpinnerModule,
    MatToolbarModule
} from '@angular/material';
import {AppRoutingModule} from './app-routing.module';
import { ListComponent } from './list/list.component';
import { DealRoomCardComponent } from './deal-room-card/deal-room-card.component';
import { DealRoomDetailsComponent } from './deal-room-details/deal-room-details.component';
import { CreateComponent } from './create/create.component';
import {Web3Service} from './util/web3.service';
import { QRCodeModule } from 'angularx-qrcode';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {BidDialogComponent} from './deal-room-details/dialogs/bid-dialog.component';
import {WithdrawDialogComponent} from './deal-room-details/dialogs/withdraw-dialog.component';
import {EndDealDialogComponent} from './deal-room-details/dialogs/end-deal-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        ListComponent,
        DealRoomCardComponent,
        DealRoomDetailsComponent,
        BidDialogComponent,
        WithdrawDialogComponent,
        EndDealDialogComponent,
        CreateComponent
    ],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatDialogModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        HttpClientModule,
        QRCodeModule,
        NgxMaterialTimepickerModule.forRoot(),
    ],
    providers: [Web3Service],
    bootstrap: [AppComponent],
    entryComponents: [
        BidDialogComponent,
        WithdrawDialogComponent,
        EndDealDialogComponent,
    ]
})
export class AppModule { }
