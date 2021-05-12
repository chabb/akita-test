import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IconsProviderModule } from './icons-provider.module';
import { NzSliderModule} from 'ng-zorro-antd/slider';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {ProgressFilterComponent} from '../pages/progress-filter/progress-filter.component';

@NgModule({
  imports:      [ CommonModule,
    NzSliderModule,
    NzStatisticModule,
    FormsModule,
    ReactiveFormsModule ],
  declarations: [ ProgressFilterComponent],
  exports: [
    // vendor
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // ng-zorro
    NzLayoutModule,
    NzCheckboxModule,
    NzMenuModule,
    NzTableModule,
    NzDropDownModule,
    NzInputModule,
    NzButtonModule,
    NzSliderModule,
    NzStatisticModule,
    IconsProviderModule,
    ProgressFilterComponent,
    // project
  ]
})
export class SharedModule { }

// non-imported exported modules are NOT used by declared components
