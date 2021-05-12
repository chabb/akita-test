import { NgModule } from '@angular/core';
import { UserTableRoutingModule } from './user-table-routing.module';
import { UserTableComponent } from './user-table.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [UserTableRoutingModule, SharedModule],
  declarations: [UserTableComponent],
  exports: [UserTableComponent]
})
export class UserTableModule { }
