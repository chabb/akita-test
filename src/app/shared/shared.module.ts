import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ ],
  exports:      [
    // vendor
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // ng-zorro
    NzLayoutModule,
    NzMenuModule,
    NzTableModule,
    NzDropDownModule,
    NzInputModule,
    NzButtonModule
    // project
  ]
})
export class SharedModule { }
