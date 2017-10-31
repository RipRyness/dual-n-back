import { Action } from '@ngrx/store';
import { Claim, Game, Round, RoundResult } from './dnb.interfaces';
export const CLAIM_MADE = 'CLAIM_MADE';
export const END_GAME = 'END_GAME';
export const FIRE_ROUND = 'FIRE_ROUND';
export const ROUND_COMPLETE = 'ROUND_COMPLETE';
export const START_GAME = 'START_GAME';

/**
 * Actions
 */

export class StartGame implements Action {
  readonly type = START_GAME;

  constructor(public payload: Game) {
    console.log(this.type);
  }
}

export class EndGame implements Action {
  readonly type = END_GAME;

  constructor() {
    console.log(this.type);
  }
}

export class FireRound implements Action {
  readonly type = FIRE_ROUND;

  constructor(public payload: Round) {
    console.log(this.type);
  }
}

export class RoundComplete implements Action {
  readonly type = ROUND_COMPLETE;

  constructor(public payload: RoundResult) {
    console.log(this.type);
  }
}

export class ClaimMaid implements Action {
  readonly type = CLAIM_MADE;

  constructor(public payload: Claim) {
    console.log(this.type);
  }
}

export type Actions = StartGame | EndGame | FireRound | RoundComplete | ClaimMaid;
