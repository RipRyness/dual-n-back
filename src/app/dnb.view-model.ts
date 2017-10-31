export interface DnbBoardLayout {
  width: number;
  height: number;
  x: number;
  y: number;
  bgColor: string;
  borderCss: string;
  lineCss: string;
  padding: number;
}

export interface DnbBoardLine {
  color: string;
  width: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DnbBoardCell {
  bgColor: string;
  width: number;
  height: number;
  x: number;
  y: number;
  hide: boolean;
}

export interface GameState {
  round: number;
  totalRounds: number;
  totalScore: number;
  possibleScore: number;
}
