import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';
import {FilterComponent} from './pages/filter/filter.component';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzSliderModule} from 'ng-zorro-antd/slider';
import {ProgressFilterComponent} from './pages/progress-filter/progress-filter.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    ProgressFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }


