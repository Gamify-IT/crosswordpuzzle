import type { question } from "./types/index";
import type { tileCrossWord} from "./types/index";
import type { position} from "./types/index";
import type  { answer} from "./types/index";
let rows: number = 20;
let columns: number = 20;
const emptyTile: tileCrossWord = {
    answer: "empty",
    currentLetter: "empty",
    startPoint: false,
    startDirection: "empty",
}


export async function generateCrossword(questions: question[]): Promise<tileCrossWord[][]>{
    let wordCount = questions.length;
    let answers: answer[] = [];
    for(let i = 0; i < wordCount; i++){
        answers.push({
            answer: questions[i].answer,
            questNumber: i+1,
        })
    }

    let crossword: tileCrossWord[][] = await simpleCrossWord(answers);

    console.log(crossword)

    let output = crossword[0].map((_, colIndex) => crossword.map(row => row[colIndex]));

    return output;
}

async function simpleCrossWord(answers: answer[]): Promise<tileCrossWord[][]>{
    return new Promise<tileCrossWord[][]>(async (resolve) => {
        let crossword: tileCrossWord[][] = new Array(rows)
                                           .fill(emptyTile)
                                           .map(() =>
                                             new Array(columns).fill(emptyTile)
                                            );
    
        //sortAnswers from large to big
        answers.sort((a,b) => b.answer.length - a.answer.length);

        //place first answer in the upper right position
        placeWordHorizontal(answers[0],0,0,crossword);
        answers.splice(0,1);
        
        //place remaining words randomly
        while(answers.length>0) {
            //choose random word
            
            let indexOfCurrentAnswer = Math.floor(Math.random() * answers.length)
            let currentAnswer = answers[indexOfCurrentAnswer];
            let placedWord = await tryPlaceWord(currentAnswer,crossword);
            if(placedWord){
                answers.splice(indexOfCurrentAnswer,1)
            }
        }
        resolve(crossword);
    })
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
                if(curInter.x-curInter.positionInWord+i>=0){ 
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
                if(curInter.y-curInter.positionInWord+i>=0){
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
        return(true);
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
        for(let i = 0; i<y; i++){
            for(let j = 0; j<crossword.length; j++){
                crossword[j].unshift(emptyTile);
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
        let firstTile: tileCrossWord = {
            answer: String(word.questNumber),
            currentLetter: "",
            startPoint: true,
            startDirection: "down"
        }
        crossword[startX][startY-1] = firstTile;
        for(let i = 0; i<characters.length; i++){
            let tile: tileCrossWord ;
            tile = {
                answer: characters[i],
                currentLetter: "",
                startPoint: false,
                startDirection: ""
            }
            crossword[startX][startY+i] = tile;
            console.log(crossword[startX][startY+i].answer+";"+characters[i]+";"+i)
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
        let firstTile: tileCrossWord = {
            answer: String(word.questNumber),
            currentLetter: "",
            startPoint: true,
            startDirection: "right"
        }
        crossword[startX-1][startY] = firstTile;
        console.log(crossword[startX-1][startY].answer+";"+word.questNumber)
        for(let i = 0; i<characters.length; i++){
            let tile: tileCrossWord ;
            tile = {
                answer: characters[i],
                currentLetter: "",
                startPoint: false,
                startDirection: ""
            }         
            crossword[startX+i][startY] = tile;
            console.log(crossword[startX+i][startY].answer+";"+characters[i]+";"+i)
        }
        resolve();
    })
}