import { BrowserModule } from '@angular/platform-browser';
import { DnbComponent } from './dnb.component';
import { DnbEffects } from './+state/dnb.effects';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { metaReducers, reducers } from './+state/dnb.reducer';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    BrowserModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([DnbEffects])
  ],
  declarations: [DnbComponent],
  bootstrap: [DnbComponent],
  providers: [DnbEffects]
})
export class DnbModule {}
