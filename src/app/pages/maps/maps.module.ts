import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps.component';
import {GoogleMapsModule} from '@angular/google-maps';
import {GlobeComponent} from './globe-component/globe.component';
import {configureRotationIntervalProvider} from './providers';


@NgModule({
  declarations: [
    MapsComponent,
    GlobeComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    MapsRoutingModule,
  ],
  providers: [
  ]
})
export class MapsModule { }
