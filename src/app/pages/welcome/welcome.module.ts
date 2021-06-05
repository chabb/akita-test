import { NgModule } from '@angular/core';import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import {ShareReplayComponent, ShareReplayInnerComponent} from '../../share-replay/share-replay.component';
import {SharedModule} from '../../shared/shared.module';
import {CyclicComponent} from './cyclic/cyclic.component';
import {CyclicAComponent} from './cyclic/cyclic-a/cyclic-a.component';
import {CyclicBComponent} from './cyclic/cyclic-b/cyclic-b.component';

@NgModule({
  imports: [WelcomeRoutingModule, SharedModule],
  declarations: [WelcomeComponent,
    CyclicComponent,
    CyclicAComponent,
    CyclicBComponent,
    ShareReplayInnerComponent,
    ShareReplayComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
