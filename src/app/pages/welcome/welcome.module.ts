import { NgModule } from '@angular/core';import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import {ShareReplayComponent, ShareReplayInnerComponent} from '../../share-replay/share-replay.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  imports: [WelcomeRoutingModule, SharedModule],
  declarations: [WelcomeComponent,
    ShareReplayInnerComponent,
    ShareReplayComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
