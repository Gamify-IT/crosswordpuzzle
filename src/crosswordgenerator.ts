import type { question } from "./types/index";
import type { tileCrossWord} from "./types/index";
const rows: number = 20;
const columns: number = 20;
const emptyTile: tileCrossWord = {
    answer: "empty",
    currentLetter: "empty",
    startPoint: false,
    startDirection: "empty",
}

export function generateCrossword(questions: question[]): tileCrossWord[][]{
        let wordCount = questions.length;
        let answers: string[] = new Array();
        for(let i = 0; i < wordCount; i++){
            answers.push(questions[i].answer.toUpperCase());
        }

        let crossword: tileCrossWord[][] = simpleCrossWord(answers);

        crossword = cutCrossword(crossword);

        console.log(crossword);

        return crossword;
}

function simpleCrossWord(answers: string[]): tileCrossWord[][]{
    let crossword: tileCrossWord[][] = new Array(rows)
                                           .fill(emptyTile)
                                           .map(() =>
                                             new Array(columns).fill(emptyTile)
                                            );
    
    //sortAnswers from large to big
    answers.sort((a,b) => b.length - a.length);

    console.log(answers);

    //place first answer in the upper right position
    crossword = placeWordHorizontal(answers[0],0,0,crossword);

    crossword = moveWordHorizontal(0,0,4,crossword);

    crossword = placeWordVertical(answers[1],0,4,crossword);

    return crossword;
}

function placeWordVertical(word:String, startX: number, startY: number, crossword: tileCrossWord[][]): tileCrossWord[][] {
    const characters = word.split("");
    for(let j = startX; j<characters.length; j++){
        let tile: tileCrossWord ;
        tile = {
            answer: characters[j],
            currentLetter: "",
            startPoint: false,
            startDirection: ""
        }
        if(j == 0){
            tile.startPoint = true;
            tile.startDirection = "down";
        }
        crossword[j][startY] = tile;
    }
    return crossword;
}

function placeWordHorizontal(word:String, startX: number, startY: number, crossword: tileCrossWord[][]): tileCrossWord[][] {
    const characters = word.split("");
    for(let j = startY; j<characters.length; j++){
        let tile: tileCrossWord ;
        tile = {
            answer: characters[j],
            currentLetter: "",
            startPoint: false,
            startDirection: ""
        }
        if(j == 0){
            tile.startPoint = true;
            tile.startDirection = "right";
        }
        crossword[startX][j] = tile;
    }
    return crossword;
}

function moveWordHorizontal(startX:number,startY:number,endX:number,crossword: tileCrossWord[][]): tileCrossWord[][]{
    let currentY = startY;
    while(crossword[startX][currentY].answer!= "empty"){
        crossword[endX][currentY] = crossword[startX][currentY];
        crossword[startX][currentY] = emptyTile;
        currentY++;
    }
    return crossword;
}

function cutCrossword(crossword: tileCrossWord[][]): tileCrossWord[][]{
    //delete rows
    for(let i = crossword.length-1; i>=0;i--){
        for(let j = crossword[i].length-1; j>=0; j--) {
            if(crossword[i][j].answer != "empty"){
                console.log(crossword[i][j].answer)
                break;
            }else if(j == 0){
                crossword.splice(i,1);
                break;
            }
        }
    }

    return crossword;
}