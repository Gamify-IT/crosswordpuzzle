import type { Answer, Position, Question, TileCrossWord } from "@/types";

let rows = 10;
let columns = 10;
const startpoints: TileCrossWord[] = [];
const emptyTile: TileCrossWord = {
  answer: "empty",
  currentLetter: "empty",
  startPoint: false,
  startDirection: "empty",
  positionX: -1,
  positionY: -1,
};
const valueOfIntersect = 10;
const maxTries = 50;
const interations = 10;

/**
 * Generates a crossword grid based on the provided questions.
 *
 * This function creates a crossword grid by placing the words from the questions in the grid
 * and ensuring that the placement maximizes the score based on intersecting letters.
 * It returns a rearranged grid with words positioned in the best possible way.
 *
 * @param questions - An array of questions that contain the answers to be placed in the crossword.
 * @returns A 2D array representing the crossword grid.
 */
export function generateCrossword(questions: Question[]): TileCrossWord[][] {
  const wordCount = questions.length;
  let answers: Answer[] = [];
  const currentAnswers: Answer[] = [];
  let score: number = Number.MIN_SAFE_INTEGER;
  let crossword: TileCrossWord[][] = [];
  for (let i = 0; i < interations; i++) {
    ({ answers, score, crossword } = createCrossword(
      answers,
      wordCount,
      questions,
      score,
      crossword,
      currentAnswers
    ));
    for (let i = 0; i < crossword.length; i++) {
      for (let j = 0; j < crossword[i].length; j++) {
        crossword[i][j].positionX = i;
        crossword[i][j].positionY = j;
      }
    }
  }

  while (currentAnswers.length > 0) {
    removeWord(currentAnswers[0], questions);
    answers.splice(0, 1);
  }

  return crossword[0].map((_, colIndex) =>
    crossword.map((row) => row[colIndex])
  );
}

/**
 * Creates the crossword grid by attempting to place words from the provided answers.
 *
 * This function iterates over the words and places them in the crossword grid.
 * It tracks the best arrangement that gives the maximum score based on intersections.
 *
 * @param answers - An array of answers to be placed in the crossword grid.
 * @param wordCount - The total number of words to place.
 * @param questions - The original questions used to generate the answers.
 * @param score - The current best score to beat.
 * @param crossword - The current state of the crossword grid.
 * @param currentAnswers - The answers that have already been placed in the crossword grid.
 * @returns The updated answers, score, and crossword grid.
 */
function createCrossword(
  answers: Answer[],
  wordCount: number,
  questions: Question[],
  score: number,
  crossword: TileCrossWord[][],
  currentAnswers: Answer[]
) {
  for (let i = 0; i < wordCount; i++) {
    answers.push({
      answer: questions[i].answer,
      questNumber: i + 1,
    });
  }
  const currentCrossword: TileCrossWord[][] = simpleCrossWord(answers);
  const currentScore: number = getScore(currentCrossword);
  if (currentScore > score) {
    score = currentScore;
    crossword = currentCrossword;
    answers.forEach((answer) => {
      currentAnswers.push(answer);
    });
  }
  return { answers, score, crossword };
}

/**
 * Generates a simple crossword grid by placing words horizontally and vertically.
 *
 * This function iterates over the list of answers and places them on the crossword grid.
 * It ensures that each word fits correctly, respecting intersections with other words.
 *
 * @param answers - The answers to be placed in the crossword grid.
 * @returns A 2D array representing the crossword grid with placed words.
 */
function simpleCrossWord(answers: Answer[]): TileCrossWord[][] {
  const crossword: TileCrossWord[][] = new Array(rows)
    .fill(emptyTile)
    .map(() => new Array(columns).fill(emptyTile));

  //place first answer in the upper right position
  let indexOfCurrentAnswer = Math.floor(Math.random() * answers.length);
  placeWordHorizontal(answers[indexOfCurrentAnswer], 0, 0, crossword);
  answers.splice(indexOfCurrentAnswer, 1);
  let tries = 0;
  //place remaining words randomly
  while (answers.length > 0 && tries < maxTries) {
    //choose random word
    indexOfCurrentAnswer = Math.floor(Math.random() * answers.length);
    const currentAnswer = answers[indexOfCurrentAnswer];
    tries++;
    const placedWord = tryPlaceWord(currentAnswer, crossword);
    if (placedWord) {
      answers.splice(indexOfCurrentAnswer, 1);
      tries = 0;
    }
  }
  return crossword;
}

/**
 * Removes a word from the list of questions and updates the crossword grid.
 *
 * This function locates the word in the question list, removes it, and adjusts the question numbers
 * accordingly. It also updates the startpoints of the crossword tiles.
 *
 * @param word - The answer to be removed.
 * @param questions - The list of questions where the word resides.
 */
function removeWord(word: Answer, questions: Question[]): void {
  let questIndex = -1;
  questions.forEach((quest, i) => {
    if (quest.answer == word.answer) {
      questIndex = i;
    }
  });
  startpoints.forEach((tile) => {
    if (Number(tile.answer) > questIndex + 1) {
      tile.answer = String(Number(tile.answer) - 1);
    }
  });
  questions.splice(questIndex, 1);
}

/**
 * Attempts to place a word on the crossword grid by checking intersections with other words.
 *
 * This function checks where the word intersects with other placed words and attempts to place it at those
 * intersection points. It will try both vertical and horizontal placements.
 *
 * @param word - The word to be placed.
 * @param crossword - The current crossword grid.
 * @returns A boolean indicating whether the word was successfully placed.
 */
function tryPlaceWord(word: Answer, crossword: TileCrossWord[][]): boolean {
  const intersections: Position[] = [];
  getIntersections(word, crossword, intersections);
  let placed = false;
  while (intersections.length > 0 && !placed) {
    const indexOfCurrentIntersection = Math.floor(
      Math.random() * intersections.length
    );
    const curInter = intersections[indexOfCurrentIntersection];
    intersections.splice(indexOfCurrentIntersection, 1);

    placed = tryPlaceHorizontal(curInter, word, crossword);
    if (!placed) {
      placed = tryPlaceVertical(curInter, word, crossword);
    }
  }
  return placed;
}

/**
 * Attempts to place a word vertically on the crossword grid at a given intersection.
 *
 * This function checks if there is enough space to place the word vertically at the given intersection point.
 * If the placement fits, the word is placed; otherwise, the function returns false.
 *
 * @param curInter - The intersection point where the word should be placed.
 * @param word - The word to be placed.
 * @param crossword - The current crossword grid.
 * @returns A boolean indicating whether the word was successfully placed.
 */
function tryPlaceVertical(
  curInter: Position,
  word: Answer,
  crossword: TileCrossWord[][]
) {
  let fit = true;
  let placed = false;
  const characters = word.answer.split("");
  characters.forEach((c, i) => {
    if (
      curInter.y - curInter.positionInWord + i >= 0 &&
      curInter.y - curInter.positionInWord + i < columns
    ) {
      if (
        c !=
        crossword[curInter.x][curInter.y - curInter.positionInWord + i].answer
      ) {
        if (
          crossword[curInter.x][curInter.y - curInter.positionInWord + i]
            .answer != "empty"
        ) {
          fit = false;
        }
      }
    }
  });
  if (curInter.y - curInter.positionInWord - 1 >= 0) {
    if (
      crossword[curInter.x][curInter.y - curInter.positionInWord - 1].answer !=
      "empty"
    ) {
      fit = false;
    }
  }
  if (fit) {
    placeWordVertical(
      word,
      curInter.x,
      curInter.y - curInter.positionInWord,
      crossword
    );
    placed = true;
  }
  return placed;
}

/**
 * Attempts to place a word horizontally on the crossword grid at a given intersection.
 *
 * This function checks if there is enough space to place the word horizontally at the given intersection point.
 * If the placement fits, the word is placed; otherwise, the function returns false.
 *
 * @param curInter - The intersection point where the word should be placed.
 * @param word - The word to be placed.
 * @param crossword - The current crossword grid.
 * @returns A boolean indicating whether the word was successfully placed.
 */
function tryPlaceHorizontal(
  curInter: Position,
  word: Answer,
  crossword: TileCrossWord[][]
): boolean {
  let fit = true;
  let placed = false;
  const characters = word.answer.split("");
  characters.forEach(async (c, i) => {
    if (
      curInter.x - curInter.positionInWord + i >= 0 &&
      curInter.x - curInter.positionInWord + i < rows
    ) {
      if (
        c !=
        crossword[curInter.x - curInter.positionInWord + i][curInter.y].answer
      ) {
        if (
          crossword[curInter.x - curInter.positionInWord + i][curInter.y]
            .answer != "empty"
        ) {
          fit = false;
        }
      }
    }
  });
  if (curInter.x - curInter.positionInWord - 1 >= 0) {
    if (
      crossword[curInter.x - curInter.positionInWord - 1][curInter.y].answer !=
      "empty"
    ) {
      fit = false;
    }
  }
  if (fit) {
    placeWordHorizontal(
      word,
      curInter.x - curInter.positionInWord,
      curInter.y,
      crossword
    );
    placed = true;
  }
  return placed;
}

/**
 * Checks if a word intersects correctly at a given position in the crossword grid.
 *
 * This function checks if the word at the given position intersects with other placed words.
 * It ensures that the word doesn't overlap inappropriately with other letters.
 *
 * @param word - The word to be checked.
 * @param pos - The position where the word should be placed.
 * @param crossword - The current crossword grid.
 * @returns A boolean indicating whether the intersection is valid.
 */
function checkIntersection(
  word: Answer,
  pos: Position,
  crossword: TileCrossWord[][]
): boolean {
  for (
    let i = Math.max(pos.x - pos.positionInWord, 0);
    i < pos.x + word.answer.length - pos.positionInWord;
    i++
  ) {
    if (
      word.answer[i - pos.x + pos.positionInWord] == crossword[i][pos.y].answer
    ) {
      return false;
    }
  }
  for (
    let i = Math.max(pos.y - pos.positionInWord, 0);
    i < pos.y + word.answer.length - pos.positionInWord;
    i++
  ) {
    if (
      word.answer[i - pos.y + pos.positionInWord] == crossword[pos.x][i].answer
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Finds all the intersection points where a word can be placed in the crossword grid.
 *
 * This function looks for all possible intersection points where the word can intersect with
 * already placed words. It stores these points for further evaluation.
 *
 * @param word - The word to be checked for intersections.
 * @param crossword - The current crossword grid.
 * @param intersections - An array to store valid intersection points.
 */
function getIntersections(
  word: Answer,
  crossword: TileCrossWord[][],
  intersections: Position[]
): void {
  for (let i = 0; i < word.answer.length; i++) {
    for (let x = 0; x < crossword.length; x++) {
      for (let y = 0; y < crossword[x].length; y++) {
        //check if letter matches cell
        if (crossword[x][y].answer == word.answer[i]) {
          intersections.push({
            x: x,
            y: y,
            positionInWord: i,
          });
        }
      }
    }
  }
  intersections.forEach(async (inter, index) => {
    const intersect = checkIntersection(word, inter, crossword);
    if (intersect) {
      intersections.splice(index, 1);
    }
  });
}

/**
 * Moves the crossword grid to accommodate placement of words.
 *
 * This function shifts the rows and columns of the crossword grid to ensure there's enough
 * space for placing words. It adjusts the grid dynamically based on the placement.
 *
 * @param x - The number of rows to move.
 * @param y - The number of columns to move.
 * @param crossword - The current crossword grid.
 */
function moveGrid(x: number, y: number, crossword: TileCrossWord[][]): void {
  for (let i = 0; i < x; i++) {
    const emptyRow: TileCrossWord[] = new Array(columns).fill(emptyTile);
    crossword.unshift(emptyRow);
    rows++;
  }
  for (let i = x; i < 0; i++) {
    const emptyRow: TileCrossWord[] = new Array(columns).fill(emptyTile);
    crossword.push(emptyRow);
    rows++;
  }
  for (let i = 0; i < y; i++) {
    for (const column of crossword) {
      column.unshift(emptyTile);
    }
    columns++;
  }
  for (let i = y; i < 0; i++) {
    for (const column of crossword) {
      column.push(emptyTile);
    }
  }
}

/**
 * Places a word vertically on the crossword grid starting from the specified position.
 *
 * This function places each character of the word on the grid, starting from the given (x, y) position,
 * and marks the start point of the word.
 *
 * @param word - The word to be placed.
 * @param startX - The starting row for the word.
 * @param startY - The starting column for the word.
 * @param crossword - The current crossword grid.
 */
function placeWordVertical(
  word: Answer,
  startX: number,
  startY: number,
  crossword: TileCrossWord[][]
): void {
  const characters = word.answer.split("");
  if (startY <= 0) {
    moveGrid(0, Math.abs(startY) + 1, crossword);
    startY += Math.abs(startY) + 1;
  }
  if (startY + word.answer.length > columns) {
    moveGrid(0, columns - startY - word.answer.length, crossword);
  }
  const firstTile: TileCrossWord = {
    answer: String(word.questNumber),
    currentLetter: "",
    startPoint: true,
    startDirection: "down",
    positionX: 0,
    positionY: 0,
  };
  crossword[startX][startY - 1] = firstTile;
  startpoints.push(firstTile);
  for (let i = 0; i < characters.length; i++) {
    crossword[startX][startY + i] = {
      answer: characters[i],
      currentLetter: "",
      startPoint: false,
      startDirection: "",
      positionX: 0,
      positionY: 0,
    };
  }
}

/**
 * Places a word horizontally on the crossword grid starting from the specified position.
 *
 * This function places each character of the word on the grid, starting from the given (x, y) position,
 * and marks the start point of the word.
 *
 * @param word - The word to be placed.
 * @param startX - The starting row for the word.
 * @param startY - The starting column for the word.
 * @param crossword - The current crossword grid.
 */
function placeWordHorizontal(
  word: Answer,
  startX: number,
  startY: number,
  crossword: TileCrossWord[][]
): void {
  const characters = word.answer.split("");
  if (startX <= 0) {
    moveGrid(Math.abs(startX) + 1, 0, crossword);
    startX += Math.abs(startX) + 1;
  }
  if (startX + word.answer.length > rows) {
    moveGrid(rows - startX - word.answer.length, 0, crossword);
  }
  const firstTile: TileCrossWord = {
    answer: String(word.questNumber),
    currentLetter: "",
    startPoint: true,
    startDirection: "right",
    positionX: startX - 1,
    positionY: startY,
  };
  crossword[startX - 1][startY] = firstTile;
  startpoints.push(firstTile);
  for (let i = 0; i < characters.length; i++) {
    crossword[startX + i][startY] = {
      answer: characters[i],
      currentLetter: "",
      startPoint: false,
      startDirection: "",
      positionX: startX + i,
      positionY: startY,
    };
  }
}

/**
 * Calculates the score for the current crossword grid based on word intersections.
 *
 * This function calculates the score by counting how many times words intersect with each other
 * in the grid. Each intersection adds to the score, and the score is also reduced based on the grid size.
 *
 * @param crossword - The current crossword grid.
 * @returns The calculated score.
 */
function getScore(crossword: TileCrossWord[][]): number {
  let intersections = 0;
  crossword.forEach(async (column, x) => {
    column.forEach((tile, y) => {
      if (tile.answer != "empty") {
        const intersect = checkIfIntersection(crossword, x, y);
        if (intersect) {
          intersections++;
        }
      }
    });
  });
  return intersections * valueOfIntersect - rows - columns;
}

/**
 * Checks if a specific tile in the crossword grid is part of an intersection.
 *
 * This function checks if the tile at the given coordinates intersects with both horizontal
 * and vertical words in the crossword grid.
 *
 * @param crossword - The current crossword grid.
 * @param x - The row index of the tile.
 * @param y - The column index of the tile.
 * @returns A boolean indicating whether the tile is part of an intersection.
 */
function checkIfIntersection(
  crossword: TileCrossWord[][],
  x: number,
  y: number
): boolean {
  const horizontal = checkInterHorizontal(crossword, x, y);
  const vertical = checkInterVertical(crossword, x, y);
  return horizontal && vertical;
}

/**
 * Checks if there is a horizontal intersection at the given coordinates.
 *
 * This function checks if the tile at the given coordinates is part of a horizontal word in the grid.
 *
 * @param crossword - The current crossword grid.
 * @param x - The row index of the tile.
 * @param y - The column index of the tile.
 * @returns A boolean indicating whether the tile is part of a horizontal intersection.
 */
function checkInterHorizontal(
  crossword: TileCrossWord[][],
  x: number,
  y: number
): boolean {
  let horizontal = false;
  while (x > 0) {
    x--;
    if (crossword[x][y].answer == "empty") {
      break;
    }
    if (
      crossword[x][y].startPoint &&
      crossword[x][y].startDirection == "right"
    ) {
      horizontal = true;
      break;
    }
  }
  return horizontal;
}

/**
 * Checks if there is a vertical intersection at the given coordinates.
 *
 * This function checks if the tile at the given coordinates is part of a vertical word in the grid.
 *
 * @param crossword - The current crossword grid.
 * @param x - The row index of the tile.
 * @param y - The column index of the tile.
 * @returns A boolean indicating whether the tile is part of a vertical intersection.
 */
function checkInterVertical(
  crossword: TileCrossWord[][],
  x: number,
  y: number
): boolean {
  let vertical = false;
  while (y > 0) {
    y--;
    if (crossword[x][y].answer == "empty") {
      break;
    }
    if (
      crossword[x][y].startPoint &&
      crossword[x][y].startDirection == "down"
    ) {
      vertical = true;
      break;
    }
  }
  return vertical;
}
