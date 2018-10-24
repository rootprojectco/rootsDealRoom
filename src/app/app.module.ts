import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
//import {MetaModule} from './meta/meta.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule
} from '@angular/material';
import {AppRoutingModule} from "./app-routing.module";
import { ListComponent } from './list/list.component';
import { DealRoomCardComponent } from './deal-room-card/deal-room-card.component';
import { DealRoomDetailsComponent } from './deal-room-details/deal-room-details.component';
import { CreateComponent } from './create/create.component';

@NgModule({
    declarations: [
        AppComponent,
        ListComponent,
        DealRoomCardComponent,
        DealRoomDetailsComponent,
        CreateComponent
    ],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
        //MetaModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
