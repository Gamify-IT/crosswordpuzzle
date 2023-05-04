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

export interface GameResult {
  correctTiles: number;
  numberOfTiles: number;
  configuration: string;
  answers: GameAnswer[];
  duration: number;
}

export interface GameAnswer {
  answer: string;
  correctAnswer: string;
  question: string;
  correct: boolean;
}

export interface QuestionAnswer {
  question: number;
  answer: string;
}
