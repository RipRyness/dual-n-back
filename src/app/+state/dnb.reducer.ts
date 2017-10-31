import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { State } from './dnb.interfaces';
import { storeFreeze } from 'ngrx-store-freeze';
import * as actions from './dnb.actions';
import * as models from './dnb.interfaces';
import * as storeService from './dnb.store-service';

export const reducers: ActionReducerMap<State> = {
  game: reducer
};

export function logger(reducerFn: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducerFn(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger, storeFreeze] : [];

export function reducer(state = storeService.newGame(), action: actions.Actions): models.Game {
  switch (action.type) {
    case actions.START_GAME: {
      return state.inProgress
        ? state
        : action.payload;
    }
    case actions.END_GAME: {
      return {
        ...state,
        inProgress: false
      };
    }
    case actions.FIRE_ROUND: {
      const completeRound = function(round: models.Round): models.RoundResult {
        if (round.index < state.nBack) {
          return storeService.newResult(round);
        }
        const soundClaim = round.claims.find(claim => claim.type === 'sound'),
          positionClaim = round.claims.find(claim => claim.type === 'position'),
          compareRound = state.results[round.index - state.nBack].round,
          needPositionClaim = compareRound.positionIndex === round.positionIndex,
          needSoundClaim = compareRound.soundIndex === round.soundIndex,
          soundCorrect = needSoundClaim === !!soundClaim,
          positionCorrect = needPositionClaim === !!positionClaim,
          score = (soundCorrect ? 1 : 0) + (positionCorrect ? 1 : 0);
          return {
            round: round,
            compareRound: compareRound,
            madePositionClaim: !!positionClaim,
            madeSoundClaim: !!soundClaim,
            positionCorrect: positionCorrect,
            possibleScore: 2,
            score: score,
            soundCorrect: soundCorrect
          };
      };

      return action.payload ? {
        ...state,
        currentRound: action.payload,
        results: !state.currentRound ? [] : [...state.results, completeRound(state.currentRound)]
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
