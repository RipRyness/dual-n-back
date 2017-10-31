export interface RoundResult {
  round: Round;
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

export interface Game {
  results: RoundResult[];
  currentRound: Round;
  inProgress: boolean;
  nBack: number;
  totalRounds: number;
}

export interface State {
  game: Game;
}
