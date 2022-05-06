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