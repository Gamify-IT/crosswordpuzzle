import { getTransitionRawChildren } from "vue";
import type { question } from "./types/index";
import type { tileCrossWord} from "./types/index";
import type { position} from "./types/index";
import type  { answer} from "./types/index";
let rows: number = 10;
let columns: number = 10;
let startpoints: tileCrossWord[] = [];
const emptyTile: tileCrossWord = {
    answer: "empty",
    currentLetter: "empty",
    startPoint: false,
    startDirection: "empty",
}


export async function generateCrossword(questions: question[]): Promise<tileCrossWord[][]>{
    let wordCount = questions.length;
    let answers: answer[] = [];
    let currentAnswers: answer[] = [];
    for(let i = 0; i < wordCount; i++){
        answers.push({
            answer: questions[i].answer,
            questNumber: i+1,
        })
        answers.forEach((answer) => {
            currentAnswers.push({
                answer: answer.answer,
                questNumber: answer.questNumber
            })
        })
    }

    let crossword: tileCrossWord[][] = await simpleCrossWord(answers, questions);
    let score: number = await getScore(crossword);

    for(let i = 0; i<4; i++){
        answers = [];
            for(let i = 0; i < wordCount; i++){
                answers.push({
                    answer: questions[i].answer,
                    questNumber: i+1,
                })
            }
        let currentCrossword: tileCrossWord[][] = await simpleCrossWord(answers, questions);
        let currentScore: number = await getScore(currentCrossword);
        if(currentScore>score){
            score = currentScore;
            crossword = currentCrossword;
            answers.forEach((answer) => {
                currentAnswers.push({
                    answer: answer.answer,
                    questNumber: answer.questNumber
                })
            })
        }
    }

    while(answers.length>0){
        removeWord(answers[0],crossword,questions)
        answers.splice(0,1);
    }
    

    let output = crossword[0].map((_, colIndex) => crossword.map(row => row[colIndex]));

    return output;
}

async function simpleCrossWord(answers: answer[], questions: question[]): Promise<tileCrossWord[][]>{
    return new Promise<tileCrossWord[][]>(async (resolve) => {
        let crossword: tileCrossWord[][] = new Array(rows)
                                           .fill(emptyTile)
                                           .map(() =>
                                             new Array(columns).fill(emptyTile)
                                            );
    
        //place first answer in the upper right position
        placeWordHorizontal(answers[0],0,0,crossword);
        answers.splice(0,1);
        let tries = 0;
        //place remaining words randomly
        while(answers.length>0 && tries < 50) {
            //choose random word
            
            let indexOfCurrentAnswer = Math.floor(Math.random() * answers.length)
            let currentAnswer = answers[indexOfCurrentAnswer];
            tries++;
            let placedWord = await tryPlaceWord(currentAnswer,crossword);
            if(placedWord){
                answers.splice(indexOfCurrentAnswer,1);
                tries = 0;
            }
        }
        resolve(crossword);
    })
}

async function removeWord(word: answer, crossword:tileCrossWord[][], questions: question[]){
    let questIndex = -1;
    questions.forEach((quest, i) => {
        if(quest.answer == word.answer){
            questIndex = i;
        }
    })
    startpoints.forEach((tile) => {
        if(Number(tile.answer)>questIndex+1){
            tile.answer = String(Number(tile.answer)-1);
        }
    })
    questions.splice(questIndex,1);
}

async function tryPlaceWord(word: answer, crossword:tileCrossWord[][]):Promise<boolean>{
    return new Promise(async (resolve) => {
        let placed = false;
        let intersections:position[] = new Array();
        let currentChar:String = '';
        await getIntersections(word, crossword, currentChar, intersections);
        intersections.forEach(async (inter,index) => {
            let intersect = await checkIntersection(word,inter, crossword);
            if(intersect){
                intersections.splice(index,1)
            }
        })
        while(intersections.length > 0){
            let indexOfCurrentIntersection = Math.floor(Math.random() * intersections.length);
            let curInter = intersections[indexOfCurrentIntersection];
            let fit = true;
            for(let i = 0;i<word.answer.length; i++){
                if(curInter.x-curInter.positionInWord+i>=0 && curInter.x-curInter.positionInWord+i<=rows){ 
                    if(word.answer[i]!=crossword[curInter.x-curInter.positionInWord+i][curInter.y].answer){
                        if(crossword[curInter.x-curInter.positionInWord+i][curInter.y].answer!="empty"){
                            fit = false;
                            break;
                        }
                    }
                }
            }
            if(curInter.x-curInter.positionInWord-1>=0){
                if(crossword[curInter.x-curInter.positionInWord-1][curInter.y].answer!="empty"){
                    fit = false;
                }
            }            
            if(fit){
                await placeWordHorizontal(word, curInter.x-curInter.positionInWord, curInter.y, crossword);
                resolve(true);
                return(true);
            }

            fit = true;
            for(let i = 0;i<curInter.y+curInter.positionInWord; i++){
                if(curInter.y-curInter.positionInWord+i>=0 && curInter.y-curInter.positionInWord+i<=columns){
                    if(word.answer[i]!=crossword[curInter.x][curInter.y-curInter.positionInWord+i].answer){
                        if(crossword[curInter.x][curInter.y-curInter.positionInWord+i].answer!="empty"){
                            fit = false;
                            break;
                        }
                    }
                }
            }
            if(curInter.y-curInter.positionInWord-1>=0){
                if(crossword[curInter.x][curInter.y-curInter.positionInWord-1].answer!="empty"){
                    fit = false;
                }
            }
            if(fit){
                await placeWordVertical(word, curInter.x, curInter.y-curInter.positionInWord, crossword);
                resolve(true);
                return(true);
            }   
        }
        resolve(false);
        return(false);
    })
}

async function checkIntersection(word: answer,pos:position, crossword:tileCrossWord[][]):Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        for(let i = pos.x-pos.positionInWord; i<pos.x+word.answer.length-pos.positionInWord;i++) {
            if(i>=0){
                if(word.answer[i-pos.x+pos.positionInWord] == crossword[i][pos.y].answer){
                    resolve(false);
                }
            }  
        }
        for(let i = pos.y-pos.positionInWord; i<pos.y+word.answer.length-pos.positionInWord; i++){
            if(i>=0){
                if(word.answer[i-pos.y+pos.positionInWord] == crossword[pos.x][i].answer){
                    resolve(false);
                }
            } 
        }
        resolve(true);
    })
}

async function getIntersections(word: answer, crossword: tileCrossWord[][], currentChar: String, intersections: position[]):Promise<void> {
    return new Promise<void>((resolve) => {
        for (let i = 0; i < word.answer.length; i++) {
            for (let x = 0; x < crossword.length; x++) {
                for (let y = 0; y < crossword[x].length; y++) {
                    currentChar = word.answer[i];
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
        resolve();
    })
}

async function moveGrid(x:number,y:number,crossword: tileCrossWord[][]):Promise<void> {
    return new Promise<void>((resolve) => {
        let emptyRow: tileCrossWord[] = new Array(columns)
                                            .fill(emptyTile);
        for(let i = 0; i<x; i++){      
            crossword.unshift(emptyRow);
            rows++;
        }
        for(let i = x; i<0; i++){
            crossword.push(emptyRow);
            rows++;
        }
        for(let i = 0; i<y; i++){
            for(let j = 0; j<crossword.length; j++){
                crossword[j].unshift(emptyTile);
            }
            columns++;
        }
        for(let i = y; i<0; i++){
            for(let j = 0; j<crossword.length; j++){
                crossword[j].push(emptyTile);
            }
            columns++;
        }
        resolve();
    })
}

async function placeWordVertical(word:answer, startX: number, startY: number, crossword: tileCrossWord[][]):Promise<void> {
    return new Promise<void>(async (resolve) => {
        const characters = word.answer.split("");
        if(startY<=0){
            await moveGrid(0,Math.abs(startY)+1,crossword);
            startY= startY+Math.abs(startY)+1;
        }
        if(startY+word.answer.length>columns){
            await moveGrid(0,columns-startY-word.answer.length,crossword);
        }
        let firstTile: tileCrossWord = {
            answer: String(word.questNumber),
            currentLetter: "",
            startPoint: true,
            startDirection: "down"
        }
        crossword[startX][startY-1] = firstTile;
        startpoints.push(firstTile);
        for(let i = 0; i<characters.length; i++){
            let tile: tileCrossWord ;
            tile = {
                answer: characters[i],
                currentLetter: "",
                startPoint: false,
                startDirection: ""
            }
            crossword[startX][startY+i] = tile;
        }
        resolve();
    })
}

async function placeWordHorizontal(word:answer, startX: number, startY: number, crossword: tileCrossWord[][]):Promise<void> {
    return new Promise<void>(async (resolve) => {
        const characters = word.answer.split("");
        if(startX<=0){
            await moveGrid(Math.abs(startX)+1,0,crossword);
            startX= startX+Math.abs(startX)+1;
        }
        if(startX+word.answer.length>rows){
            await moveGrid(columns-startX-word.answer.length,0,crossword);
        }
        let firstTile: tileCrossWord = {
            answer: String(word.questNumber),
            currentLetter: "",
            startPoint: true,
            startDirection: "right"
        }
        crossword[startX-1][startY] = firstTile;
        startpoints.push(firstTile);
        for(let i = 0; i<characters.length; i++){
            let tile: tileCrossWord ;
            tile = {
                answer: characters[i],
                currentLetter: "",
                startPoint: false,
                startDirection: ""
            }         
            crossword[startX+i][startY] = tile;
        }
        resolve();
    })
}

async function getScore(crossword:tileCrossWord[][]):Promise<number> {
    return new Promise<number>(async (resolve) => {
        let intersections = 0;
        for(let i = 0; i<crossword.length; i++){
            for(let j = 0; j<crossword.length; j++){
                if(crossword[i][j].answer!="empty"){
                    let intersect = await checkIfIntersection(crossword,i,j);
                    if(intersect){
                        intersections++;
                    }
                }
            }
        }
        console.log(intersections)
        let result = intersections*10-rows-columns   
        resolve(result)     
    })
}

async function checkIfIntersection(crossword:tileCrossWord[][],x:number,y:number):Promise<boolean>{
    return new Promise<boolean>((resolve)=>{
        let currentX = x;
        let currentY = y;
        let horizontal = false;
        let vertical = false;
        while(true){
            if(currentX<0){
                break;
            }
            if(crossword[currentX][currentY].answer=="empty"){
                break;
            }
            if(crossword[currentX][currentY].startPoint){
                horizontal = true;
                break;
            }
            currentX--;
        }
        while(true){
            if(currentY<0){
                break;
            }
            if(crossword[currentX] === undefined){
                break;
            }
            if(crossword[currentX][currentY] === undefined){
                break;
            }
            if(crossword[currentX][currentY].answer=="empty"){
                break;
            }
            if(crossword[currentX][currentY].startPoint){
                horizontal = true;
                break;
            }
            currentY--;
        }
        if(horizontal&&vertical){
            resolve(true)
        }
        resolve(false)
    })
}