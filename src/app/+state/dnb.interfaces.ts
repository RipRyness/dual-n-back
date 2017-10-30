export interface RoundResult {
  compareRound: Round;
  madePositionClaim: boolean;
  madeSoundClaim: boolean;
  positionCorrect: boolean;
  possibleScore: number;
  score: number;
  soundCorrect: boolean;
}

export interface Round {
  index: number;
  positionIndex: number;
  soundIndex: number;
  claims: Claim[];
}

export interface Claim {
  index: number;
  type: 'sound' | 'position';
}

export interface CompletedRound {
  result: RoundResult;
  round: Round;
}

export interface Game {
  completedRounds: CompletedRound[];
  currentRound: Round;
  inProgress: boolean;
  nBack: number;
}

export interface State {
  game: Game;
}
