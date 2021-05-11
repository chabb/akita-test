import { NgModule } from '@angular/core';

import { UserTableRoutingModule } from './user-table-routing.module';
import {UserTableComponent} from './user-table.component';


@NgModule({
  imports: [UserTableRoutingModule],
  declarations: [UserTableComponent],
  exports: [UserTableComponent]
})
export class UserTableModule { }
