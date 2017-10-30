import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as actions from './dnb.actions';
import * as models from './dnb.interfaces';
import * as storeService from './dnb.store-service';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/observable/interval';

@Injectable()
export class DnbEffects {
  readonly totalRounds = 24;
  currentRound = -1;
  gameRoundCreator$ = Observable.interval(3000).take(this.totalRounds);
  game: Subscription;
  constructor(private actions$: Actions, private store: Store<models.Game>) {}

  @Effect()
  startGame$ = this.actions$.ofType(actions.START_GAME).map(() => {
    this.currentRound++;
    this.game = this.gameRoundCreator$.subscribe(() => {
      this.currentRound++;
      this.store.dispatch(new actions.FireRound(storeService.newRound(this.currentRound)));
      if (this.currentRound === this.totalRounds) {
        this.store.dispatch(new actions.EndGame());
      }
    });
    return new actions.FireRound(storeService.newRound(this.currentRound));
  });

  @Effect({ dispatch: false })
  endGame$ = this.actions$.ofType(actions.END_GAME).do(() => {
    this.currentRound = -1;
    this.game.unsubscribe();
  });

  @Effect({ dispatch: false })
  fireRound$ = this.actions$.ofType<actions.FireRound>(actions.FIRE_ROUND).map(action => action.payload);
}
