import type { question } from "./types/index";
import type { tileCrossWord} from "./types/index";
import type { position} from "./types/index";
let rows: number = 20;
let columns: number = 20;
const emptyTile: tileCrossWord = {
    answer: "empty",
    currentLetter: "empty",
    startPoint: false,
    startDirection: "empty",
}
const emptyRow: tileCrossWord[] = new Array(rows)
                                            .fill(emptyTile);

export async function generateCrossword(questions: question[]): Promise<tileCrossWord[][]>{
        let wordCount = questions.length;
        let answers: string[] = new Array();
        for(let i = 0; i < wordCount; i++){
            answers.push(questions[i].answer.toUpperCase());
        }

        let crossword: tileCrossWord[][] = await simpleCrossWord(answers);

        //cutCrossword(crossword);

        console.log(crossword)

        return crossword;
}

async function simpleCrossWord(answers: string[]): Promise<tileCrossWord[][]>{
    let crossword: tileCrossWord[][] = new Array(rows)
                                           .fill(emptyTile)
                                           .map(() =>
                                             new Array(columns).fill(emptyTile)
                                            );
    
    //sortAnswers from large to big
    answers.sort((a,b) => b.length - a.length);

    console.log(answers);

    //place first answer in the upper right position
    placeWordHorizontal(answers[0],0,0,crossword);
    answers.splice(0,1);

    //place remaining words randomly
    while(answers.length>0) {
        let wordCount = getNumberOfWords(crossword);
        //choose random word
        let indexOfCurrentWord = Math.floor(Math.random() * answers.length)
        let currentWord = answers[indexOfCurrentWord];
        console.log(crossword);
        if(await tryPlaceWord(currentWord,crossword)){
            answers.splice(indexOfCurrentWord,1)
            console.log("Testsplice")
        }
    }

    return crossword;
}

function getNumberOfWords(crossword:tileCrossWord[][]):number{
    let numberOfWords = 0;
    for(let i = 0; i < crossword.length; i++){
        for(let j = 0; j<crossword[i].length; j++){
            if(crossword[i][j].startPoint){
                numberOfWords++;
            }
        }
    }
    return numberOfWords;
}

async function tryPlaceWord(word: String, crossword:tileCrossWord[][]):Promise<boolean>{
    let placed = false;
    let intersections:position[] = new Array();
    let currentChar:String = '';
    getIntersections(word, crossword, currentChar, intersections);
    intersections.forEach((inter,index) => {
        if(checkIntersection(word,inter, crossword)){
            intersections.splice(index,1)
        }
    })
    while(intersections.length > 0){
        let indexOfCurrentIntersection = Math.floor(Math.random() * intersections.length);
        let curInter = intersections[indexOfCurrentIntersection];
        let fit = true;
        for(let i = 0;i<word.length; i++){
            if(curInter.x-curInter.positionInWord+i>=0){ 
                if(word[i]!=crossword[curInter.x-curInter.positionInWord+i][curInter.y].answer){
                    if(crossword[curInter.x-curInter.positionInWord+i][curInter.y].answer!="empty"){
                        fit = false;
                        break;
                    }
                }
            }
        }
        if(fit){
            console.log("Horizontal;x:"  + (curInter.x-curInter.positionInWord) + "; y:" + curInter.y + "; word:" + word)
            await placeWordHorizontal(word, curInter.x-curInter.positionInWord, curInter.y, crossword);
            return true;
        }
        fit = true;
        for(let i = 0;i<curInter.y+curInter.positionInWord; i++){
            if(curInter.y-curInter.positionInWord+i>=0){
                if(word[i]!=crossword[curInter.x][curInter.y-curInter.positionInWord+i].answer){
                    if(crossword[curInter.x][curInter.y-curInter.positionInWord+i].answer!="empty"){
                        fit = false;
                        break;
                    }
                }
            }
        }
        if(fit){
            console.log("Vertical;x:"  + curInter.x + "; y:" + (curInter.y-curInter.positionInWord) + "; word:" + word)
            await placeWordVertical(word, curInter.x, curInter.y-curInter.positionInWord, crossword);
            return true;
        }
    }
    return false;
}

function checkIntersection(word: String,pos:position, crossword:tileCrossWord[][]):boolean {
    for(let i = pos.x-pos.positionInWord; i<pos.x+word.length-pos.positionInWord;i++) {
        if(i>=0){
            if(word[i-pos.x+pos.positionInWord] == crossword[i][pos.y].answer){
                return false;
            }
        }  
    }
    for(let i = pos.y-pos.positionInWord; i<pos.y+word.length-pos.positionInWord; i++){
        if(i>=0){
            if(word[i-pos.y+pos.positionInWord] == crossword[pos.x][i].answer){
                return false;
            }
        } 
    }
    return true;
}

function getIntersections(word: String, crossword: tileCrossWord[][], currentChar: String, intersections: position[]) {
    for (let i = 0; i < word.length; i++) {
        for (let x = 0; x < crossword.length; x++) {
            for (let y = 0; y < crossword[x].length; y++) {
                currentChar = word[i];
                //check if letter matches cell
                if (crossword[x][y].answer == currentChar) {
                    intersections.push({
                        x: x,
                        y: y,
                        positionInWord: i,
                    });
                }
            }
        }
    }
}

function moveGrid(x:number,y:number,crossword: tileCrossWord[][]) {
    return new Promise<void>((resolve) => {
        console.log("x:"+ x + "; y:" + y) 
        for(let i = 0; i<x; i++){      
            crossword.unshift(emptyRow);
            rows++;
        }
        for(let i = 0; i<y; i++){
            for(let j = 0; j<crossword.length; j++){
                crossword[j].unshift(emptyTile);
            }
            columns++;
        }
        resolve();
    })
    
}

function placeWordVertical(word:String, startX: number, startY: number, crossword: tileCrossWord[][]) {
    return new Promise<void>(async (resolve) => {
        const characters = word.split("");
    if(startY<0){
        await moveGrid(0,Math.abs(startY),crossword);
        startY= startY+Math.abs(startY);
    }
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
            tile.startDirection = "down";
        }
        crossword[startX][j] = tile;
    }
    resolve();
    })
}

function placeWordHorizontal(word:String, startX: number, startY: number, crossword: tileCrossWord[][]) {
    return new Promise<void>(async (resolve) => {
        if(startX<0){
            await moveGrid(Math.abs(startX),0,crossword);
            startX= startX+Math.abs(startX);
        }
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
                tile.startDirection = "right";
            }
            crossword[j][startY] = tile;
        }
        resolve();
    })
}

function moveWordHorizontal(startX:number,startY:number,endX:number,crossword: tileCrossWord[][]){
    let currentY = startY;
    while(crossword[startX][currentY].answer!= "empty"){
        crossword[endX][currentY] = crossword[startX][currentY];
        crossword[startX][currentY] = emptyTile;
        currentY++;
    }
}

function cutCrossword(crossword: tileCrossWord[][]){
    //delete rows
    for(let i = crossword.length-1; i>=0;i--){
        for(let j = crossword[i].length-1; j>=0; j--) {
            if(crossword[i][j].answer != "empty"){
                break;
            }else if(j == 0){
                crossword.splice(i,1);
                break;
            }
        }
    }
}