import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Claim, Game, Round, RoundResult } from './dnb.interfaces';

const randomNum = function(bottom, top) {
  return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
};

const newResult = function() {
  return {
    compareRound: null,
    madePositionClaim: false,
    madeSoundClaim: false,
    positionCorrect: false,
    possibleScore: 0,
    score: 0,
    soundCorrect: false
  } as RoundResult;
};

const newRound = function(index: number) {
  return {
    index: index,
    positionIndex: randomNum(0, 8),
    soundIndex: randomNum(0, 7),
    claims: [] as Claim[]
  } as Round;
};

const newBoard = function() {
  return { cells: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(c => ({ show: false })) };
};

const newGame = function() {
  return {
    completedRounds: [],
    currentRound: null,
    inProgress: false,
    nBack: 2,
    board: newBoard()
  } as Game;
};

const getGameState = createFeatureSelector<Game>('game');
const getGame = createSelector(getGameState, game => game);
const getGameCurrentRound = createSelector(getGame, game => game.currentRound);
const getGameRounds = createSelector(getGame, game => game.completedRounds);

export { newResult, newRound, newGame, getGame, getGameRounds, getGameCurrentRound };
