import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListComponent} from './list/list.component';
import {DealRoomDetailsComponent} from './deal-room-details/deal-room-details.component';
import {CreateComponent} from './create/create.component';

const routes: Routes = [
    {path: '', component: ListComponent},
    {path: 'address/:address', component: DealRoomDetailsComponent},
    {path: 'create', component: CreateComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
