/**
 * Represents the outcome of a game session, including performance metrics like correct tiles,
 * total tiles, answers, duration, and score.
 */

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

export class GameResult {
 public constructor(
     public correctTiles: number,
  public numberOfTiles: number,
     public configuration: string,
     public answers: GameAnswer[],
     public duration: number,
     public score: number,
     public rewards: number){}
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
