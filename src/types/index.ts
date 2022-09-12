export interface Question {
  questionText: string;
  answer: string;
}

export interface TileCrossWord {
  answer: string;
  currentLetter: string;
  startPoint: boolean;
  startDirection: string;
  positionX: number;
  positionY: number;
}

export interface Position {
  x: number;
  y: number;
  positionInWord: number;
}

export interface Answer {
  answer: string;
  questNumber: number;
}
