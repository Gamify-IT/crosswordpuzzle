import type { Question, TileCrossWord, Position, Answer } from "./types/index";
let rows = 10;
let columns = 10;
const startpoints: TileCrossWord[] = [];
const emptyTile: TileCrossWord = {
  answer: "empty",
  currentLetter: "empty",
  startPoint: false,
  startDirection: "empty",
};
const valueOfIntersect = 10;
const maxTries = 50;
const interations = 10;

export async function generateCrossword(
  questions: Question[]
): Promise<TileCrossWord[][]> {
  const wordCount = questions.length;
  let answers: Answer[] = [];
  const currentAnswers: Answer[] = [];
  let score: number = Number.MIN_SAFE_INTEGER;
  let crossword: TileCrossWord[][] = [];
  for (let i = 0; i < interations; i++) {
    ({ answers, score, crossword } = await createCrossword(
      answers,
      wordCount,
      questions,
      score,
      crossword,
      currentAnswers
    ));
  }

  while (currentAnswers.length > 0) {
    removeWord(currentAnswers[0], questions);
    answers.splice(0, 1);
  }

  return crossword[0].map((_, colIndex) =>
    crossword.map((row) => row[colIndex])
  );
}

async function createCrossword(
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
  const currentCrossword: TileCrossWord[][] = await simpleCrossWord(answers);
  const currentScore: number = await getScore(currentCrossword);
  if (currentScore > score) {
    score = currentScore;
    crossword = currentCrossword;
    answers.forEach((answer) => {
      currentAnswers.push(answer);
    });
  }
  return { answers, score, crossword };
}

async function simpleCrossWord(answers: Answer[]): Promise<TileCrossWord[][]> {
  return new Promise<TileCrossWord[][]>(async (resolve) => {
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
      const placedWord = await tryPlaceWord(currentAnswer, crossword);
      if (placedWord) {
        answers.splice(indexOfCurrentAnswer, 1);
        tries = 0;
      }
    }
    resolve(crossword);
  });
}

async function removeWord(word: Answer, questions: Question[]) {
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

async function tryPlaceWord(
  word: Answer,
  crossword: TileCrossWord[][]
): Promise<boolean> {
  return new Promise(async (resolve) => {
    const intersections: Position[] = [];
    await getIntersections(word, crossword, intersections);
    let placed = false;
    while (intersections.length > 0 && !placed) {
      const indexOfCurrentIntersection = Math.floor(
        Math.random() * intersections.length
      );
      const curInter = intersections[indexOfCurrentIntersection];
      intersections.splice(indexOfCurrentIntersection, 1);

      placed = await tryPlaceHorizontal(curInter, word, crossword);
      if (!placed) {
        placed = await tryPlaceVertical(curInter, word, crossword);
      }
    }
    resolve(placed);
  });
}

async function tryPlaceVertical(
  curInter: Position,
  word: Answer,
  crossword: TileCrossWord[][]
) {
  let fit = true;
  let placed = false;
  const characters = word.answer.split("");
  characters.forEach(async (c, i) => {
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
    await placeWordVertical(
      word,
      curInter.x,
      curInter.y - curInter.positionInWord,
      crossword
    );
    placed = true;
  }
  return placed;
}

async function tryPlaceHorizontal(
  curInter: Position,
  word: Answer,
  crossword: TileCrossWord[][]
) {
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
    await placeWordHorizontal(
      word,
      curInter.x - curInter.positionInWord,
      curInter.y,
      crossword
    );
    placed = true;
  }
  return placed;
}

async function checkIntersection(
  word: Answer,
  pos: Position,
  crossword: TileCrossWord[][]
): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    for (
      let i = Math.max(pos.x - pos.positionInWord, 0);
      i < pos.x + word.answer.length - pos.positionInWord;
      i++
    ) {
      if (
        word.answer[i - pos.x + pos.positionInWord] ==
        crossword[i][pos.y].answer
      ) {
        resolve(false);
        break;
      }
    }
    for (
      let i = Math.max(pos.y - pos.positionInWord, 0);
      i < pos.y + word.answer.length - pos.positionInWord;
      i++
    ) {
      if (
        word.answer[i - pos.y + pos.positionInWord] ==
        crossword[pos.x][i].answer
      ) {
        resolve(false);
        break;
      }
    }
    resolve(true);
  });
}

async function getIntersections(
  word: Answer,
  crossword: TileCrossWord[][],
  intersections: Position[]
): Promise<void> {
  return new Promise<void>(async (resolve) => {
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
      const intersect = await checkIntersection(word, inter, crossword);
      if (intersect) {
        intersections.splice(index, 1);
      }
    });
    resolve();
  });
}

async function moveGrid(
  x: number,
  y: number,
  crossword: TileCrossWord[][]
): Promise<void> {
  return new Promise<void>(async (resolve) => {
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
    resolve();
  });
}

async function placeWordVertical(
  word: Answer,
  startX: number,
  startY: number,
  crossword: TileCrossWord[][]
): Promise<void> {
  return new Promise<void>(async (resolve) => {
    const characters = word.answer.split("");
    if (startY <= 0) {
      await moveGrid(0, Math.abs(startY) + 1, crossword);
      startY += Math.abs(startY) + 1;
    }
    if (startY + word.answer.length > columns) {
      await moveGrid(0, columns - startY - word.answer.length, crossword);
    }
    const firstTile: TileCrossWord = {
      answer: String(word.questNumber),
      currentLetter: "",
      startPoint: true,
      startDirection: "down",
    };
    crossword[startX][startY - 1] = firstTile;
    startpoints.push(firstTile);
    for (let i = 0; i < characters.length; i++) {
      const tile: TileCrossWord = {
        answer: characters[i],
        currentLetter: "",
        startPoint: false,
        startDirection: "",
      };
      crossword[startX][startY + i] = tile;
    }
    resolve();
  });
}

async function placeWordHorizontal(
  word: Answer,
  startX: number,
  startY: number,
  crossword: TileCrossWord[][]
): Promise<void> {
  return new Promise<void>(async (resolve) => {
    const characters = word.answer.split("");
    if (startX <= 0) {
      await moveGrid(Math.abs(startX) + 1, 0, crossword);
      startX += Math.abs(startX) + 1;
    }
    if (startX + word.answer.length > rows) {
      await moveGrid(rows - startX - word.answer.length, 0, crossword);
    }
    const firstTile: TileCrossWord = {
      answer: String(word.questNumber),
      currentLetter: "",
      startPoint: true,
      startDirection: "right",
    };
    crossword[startX - 1][startY] = firstTile;
    startpoints.push(firstTile);
    crossword[startX - 1][startY] = firstTile;
    for (let i = 0; i < characters.length; i++) {
      const tile: TileCrossWord = {
        answer: characters[i],
        currentLetter: "",
        startPoint: false,
        startDirection: "",
      };
      crossword[startX + i][startY] = tile;
    }
    resolve();
  });
}

async function getScore(crossword: TileCrossWord[][]): Promise<number> {
  return new Promise<number>(async (resolve) => {
    let intersections = 0;
    crossword.forEach(async (column, x) => {
      column.forEach(async (tile, y) => {
        if (tile.answer != "empty") {
          const intersect = await checkIfIntersection(crossword, x, y);
          if (intersect) {
            intersections++;
          }
        }
      });
    });
    const result = intersections * valueOfIntersect - rows - columns;
    resolve(result);
  });
}

async function checkIfIntersection(
  crossword: TileCrossWord[][],
  x: number,
  y: number
): Promise<boolean> {
  return new Promise<boolean>(async (resolve) => {
    const horizontal = checkInterHorizontal(crossword, x, y);
    const vertical = checkInterVertical(crossword, x, y);
    if (horizontal && vertical) {
      resolve(true);
    }
    resolve(false);
  });
}

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
