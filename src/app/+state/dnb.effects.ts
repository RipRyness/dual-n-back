import { Actions, Effect } from '@ngrx/effects';
import { getLastRoundResult } from './dnb.store-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import * as actions from './dnb.actions';
import * as models from './dnb.interfaces';
import * as storeService from './dnb.store-service';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeLast';
import 'rxjs/observable/interval';

@Injectable()
export class DnbEffects {
  readonly destroyed$ = new Subject<boolean>();
  currentRoundIndex = -1;
  gameRoundCreator$: Observable<any>;
  game: Subscription;
  constructor(private actions$: Actions, private store: Store<models.Game>) {}

  @Effect()
  startGame$ = this.actions$
    .ofType<actions.StartGame>(actions.START_GAME)
    .map(action => {
      const totalRounds = action.payload.totalRounds;
      this.gameRoundCreator$ = Observable.interval(3000).take(totalRounds);
      this.currentRoundIndex++;
      this.game = this.gameRoundCreator$.subscribe(() => {
        this.currentRoundIndex++;
        this.store.dispatch(new actions.FireRound(storeService.newRound(this.currentRoundIndex)));
        if (this.currentRoundIndex === totalRounds) {
          this.store.dispatch(new actions.EndGame());
        }
      });
      return new actions.FireRound(storeService.newRound(this.currentRoundIndex));
    });

  @Effect({ dispatch: false })
  endGame$ = this.actions$
    .ofType(actions.END_GAME)
    .do(() => {
      this.currentRoundIndex = -1;
      this.game.unsubscribe();
    });

  @Effect({ dispatch: false })
  fireRound$ = this.actions$
    .ofType<actions.FireRound>(actions.FIRE_ROUND)
    .map(action => {
      this.store.select<models.RoundResult>(getLastRoundResult)
        .take(1)
        .takeUntil(this.destroyed$)
        .do(result => this.store.dispatch(new actions.RoundComplete(result)))
        .subscribe();
      return action.payload;
    });

  @Effect({ dispatch: false })
  roundComplete$ = this.actions$
    .ofType<actions.RoundComplete>(actions.ROUND_COMPLETE)
    .map(action => action.payload);
}
