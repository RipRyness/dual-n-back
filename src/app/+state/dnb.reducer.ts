import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { State } from './dnb.interfaces';
import { storeFreeze } from 'ngrx-store-freeze';
import * as actions from './dnb.actions';
import * as store from './dnb.interfaces';
import * as storeService from './dnb.store-service';

export const reducers: ActionReducerMap<State> = {
  game: reducer
};

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger, storeFreeze] : [];

export function reducer(state = storeService.newGame(), action: actions.Actions): store.Game {
  switch (action.type) {
    case actions.START_GAME: {
      return state.inProgress
        ? state
        : {
            ...storeService.newGame(),
            completedRounds: [],
            inProgress: true
          };
    }
    case actions.END_GAME: {
      return {
        ...state,
        inProgress: false
      };
    }
    case actions.FIRE_ROUND: {
      const completeRound = function(round: store.Round): store.CompletedRound {
        if (round.index < state.nBack) {
          return {
            result: storeService.newResult(),
            round: round
          };
        }
        const soundClaim = round.claims.find(claim => claim.type === 'sound'),
          positionClaim = round.claims.find(claim => claim.type === 'position'),
          compareRound = state.completedRounds[round.index - state.nBack].round,
          soundCorrect = !soundClaim ? false : compareRound.soundIndex === soundClaim.index,
          positionCorrect = !positionClaim ? false : compareRound.positionIndex === positionClaim.index,
          score = (soundCorrect ? 1 : 0) + (positionCorrect ? 1 : 0),
          result: store.RoundResult = {
            compareRound: compareRound,
            madePositionClaim: !!positionClaim,
            madeSoundClaim: !!soundClaim,
            positionCorrect: positionCorrect,
            possibleScore: 2,
            score: score,
            soundCorrect: soundCorrect
          };

        return {
          result: result,
          round: round
        };
      };

      return action.payload ? {
        ...state,
        currentRound: action.payload,
        completedRounds: !state.currentRound ? [] : [...state.completedRounds, completeRound(state.currentRound)]
      } : state;
    }
    case actions.CLAIM_MADE: {
      if (state.currentRound.claims.find(claim => claim.type === action.payload.type)) {
        return state;
      }
      return {
        ...state,
        currentRound: {
          ...state.currentRound,
          claims: [...state.currentRound.claims, action.payload]
        }
      };
    }
    default: {
      return state;
    }
  }
}
