import { Claim, Round } from './dnb.interfaces';
import { Action } from '@ngrx/store';
export const START_GAME = 'START_GAME';
export const END_GAME = 'END_GAME';
export const FIRE_ROUND = 'FIRE_ROUND';
export const CLAIM_MADE = 'CLAIM_MADE';

/**
 * Actions
 */

export class StartGame implements Action {
  readonly type = START_GAME;

  constructor() {
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

export class ClaimMaid implements Action {
  readonly type = CLAIM_MADE;

  constructor(public payload: Claim) {
    console.log(this.type);
  }
}

export type Actions = StartGame | EndGame | FireRound | ClaimMaid;
