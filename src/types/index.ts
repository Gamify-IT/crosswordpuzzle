export interface question {
  question: string;
  answer: string;
}

export interface tileCrossWord {
  answer: string;
  currentLetter: string;
  startPoint: boolean;
  startDirection: string;
}

export interface position {
  x: number;
  y: number;
  positionInWord: number;
}

export interface answer {
  answer: string;
  questNumber: number;
}
