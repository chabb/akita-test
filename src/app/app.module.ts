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
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {configureConfigProvider} from './configuration.provider';
import {configureRotationIntervalProvider} from './pages/maps/providers';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent
  ],
  imports: [
    // angular
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    // vendored
    NzEmptyModule,
    NzSwitchModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    // local
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    configureConfigProvider('test'),
    configureRotationIntervalProvider()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


