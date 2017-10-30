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

export const newDnbBoardCell = function(): DnbBoardCell {
  return {
    bgColor: '#b47952',
    width: 50,
    height: 50,
    x: 0,
    y: 0,
    hide: false
  };
};

export const newDnbBoardLine = function(): DnbBoardLine {
  return {
    color: '#5a85b4',
    width: 1,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  };
};

export const newDnbBoardLayout = function(): DnbBoardLayout {
  return {
    width: 600,
    height: 600,
    x: 600,
    y: 600,
    bgColor: '#fff',
    borderCss: '#c4c9f3 solid thin',
    lineCss: '#c4c9f3 solid thin',
    padding: 50
  };
};
