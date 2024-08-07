<script setup lang="ts">
import { generateCrossword } from "@/crosswordgenerator";
import { ref } from "vue";
import { Modal } from "bootstrap";
import InputField from "@/components/InputField.vue";
import { store } from "@/store";
import type { GameResult, Question, QuestionAnswer } from "@/types";
import { GameAnswer, TileCrossWord } from "@/types";
import { useRoute } from "vue-router";
import { submitGameResult } from "@/ts/restClient";
import { useToast } from "vue-toastification";
import storeTwo from "@/store/indexTwo";
import clickSoundSource from '/src/assets/music/click_sound.mp3';
import successSoundSource from '/src/assets/music/success_sound.mp3';
import errorSoundSource from '/src/assets/music/error_sound.mp3';

const evaluationModal = ref();
const direction = ref("");

let submitted = false;
const time = Date.now();

//Test
const route = useRoute();
const toast = useToast();
const configuration = route.params.id as string;

let questions: Question[] = store.state.questions;
console.log(questions);

questions.forEach((question) => {
  //workaround cause script is case-sensitive
  question.answer = question.answer.toUpperCase();
});
const crosswordpuzzle = generateCrossword(questions);
console.log(crosswordpuzzle);

const evaluationModalContext = ref({ title: "", text: "" });

function getWrongQuestion(element: TileCrossWord): QuestionAnswer[] {
  return [
    getWrongQuestionVertical(element),
    getWrongQuestionHorizontal(element),
  ];
}

function getWrongQuestionHorizontal(element: TileCrossWord): QuestionAnswer {
  for (let i = element.positionX; i >= 0; i--) {
    if (
        crosswordpuzzle[element.positionY][i].startPoint &&
        crosswordpuzzle[element.positionY][i].startDirection === "right"
    ) {
      let answer = "";
      let questionNumber = Number(crosswordpuzzle[element.positionY][i].answer);
      for (
          let j = i + 1;
          j < i + questions[questionNumber - 1].answer.length;
          j++
      ) {
        if (crosswordpuzzle[element.positionY][j].currentLetter != "empty") {
          answer += crosswordpuzzle[element.positionY][j].currentLetter;
        } else {
          break;
        }
      }
      return {
        question: questionNumber,
        answer: answer,
      };
    }
  }
  return {
    question: 0,
    answer: "",
  };
}

function getWrongQuestionVertical(element: TileCrossWord): QuestionAnswer {
  for (let i = element.positionY; i >= 0; i--) {
    if (
        crosswordpuzzle[i][element.positionX].startPoint &&
        crosswordpuzzle[i][element.positionX].startDirection === "down"
    ) {
      let answer = "";
      let questionNumber = Number(crosswordpuzzle[i][element.positionX].answer);
      for (
          let j = i + 1;
          j < questions[questionNumber - 1].answer.length;
          j++
      ) {
        if (crosswordpuzzle[j][element.positionX].currentLetter != "empty") {
          answer += crosswordpuzzle[j][element.positionX].currentLetter;
        } else {
          break;
        }
      }
      return {
        question: questionNumber,
        answer: answer,
      };
    }
  }
  return {
    question: 0,
    answer: "",
  };
}

async function evaluateSolution() {
  let isCorrect = true;
  let wrongTiles = 0;
  let numberOfTiles = 0;
  let wrongQuestions = new Set<number>();
  let answers = new Set<GameAnswer>();

  playSound(clickSoundSource);

  crosswordpuzzle.forEach((crosswordRow) => {
    crosswordRow.forEach((element) => {
      if (element.currentLetter != "empty" && !element.startPoint) {
        numberOfTiles++;
      }
      const charsAreEqual =
          element.currentLetter.toUpperCase() != element.answer.toUpperCase();
      if (charsAreEqual && !element.startPoint) {
        getWrongQuestion(element).forEach((wrongQuestion) => {
          if (
              wrongQuestion.question != 0 &&
              !wrongQuestions.has(wrongQuestion.question)
          ) {
            answers.add({
              answer: "",
              correctAnswer: questions[wrongQuestion.question - 1].answer,
              question: questions[wrongQuestion.question - 1].questionText,
              correct: false,
            });
            wrongQuestions.add(wrongQuestion.question);
          }
        });
        isCorrect = false;
        wrongTiles++;
      }
    });
  });

  if (isCorrect) {
    playSound(successSoundSource);
    evaluationModalContext.value.title = "Congratulations! 🥳";
    evaluationModalContext.value.text = "Everything right!";
    questions.forEach((question) => {
      answers.add({
        answer: question.answer,
        correctAnswer: question.answer,
        question: question.questionText,
        correct: true,
      });
    });
  } else {
    playSound(errorSoundSource);
    questions.forEach((question, index) => {
      if (!wrongQuestions.has(index + 1)) {
        answers.add({
          answer: question.answer,
          correctAnswer: question.answer,
          question: question.questionText,
          correct: true,
        });
      }
    });
    evaluationModalContext.value.title = "Not the correct answers";
    evaluationModalContext.value.text = "Maybe the next time";
  }

  const gameResult: GameResult = {
    correctTiles: numberOfTiles - wrongTiles,
    numberOfTiles: numberOfTiles,
    configuration: configuration,
    answers: Array.from(answers),
    duration: (Date.now() - time) / 1000,
    score: ((numberOfTiles - wrongTiles) / numberOfTiles) * 100,
    rewards: 0
  };

  if (!submitted) {
    try {
      await submitGameResult(gameResult);
      let rewards = storeTwo.state.rewards;
      let score = gameResult.score;
      let scoreText = `<span class="gold-text">${score} score</span>`;
      let rewardsText = `<span class="gold-text">${rewards} coins</span>`;

      if (score < 50) {
        evaluationModalContext.value.title = "🙌 Don't give up! 🙌";
        evaluationModalContext.value.text = `You've got this! You've gained ${rewardsText} and ${scoreText}.`;
      } else if (score < 70) {
        evaluationModalContext.value.title = "🏆 Nice! 🏆";
        evaluationModalContext.value.text = `Good job! You've gained ${rewardsText} and ${scoreText}.`;
      } else {
        evaluationModalContext.value.title = "🏅 Wow, congratulations! 🏅";
        evaluationModalContext.value.text = `Keep it up! You've gained ${rewardsText} and ${scoreText}.`;
      }

      questions.forEach((question, index) => {
        answers.add({
          answer: question.answer,
          correctAnswer: question.answer,
          question: question.questionText,
          correct: !wrongQuestions.has(index + 1),
        });
      });

    } catch (error) {
      toast.error(
          "Result could not be sent to the overworld backend. Please try again later or contact an admin."
      );
      console.log(error);
    }
    submitted = true;
  }

  const modal = new Modal(evaluationModal.value);
  modal.show();
}

function setDirection(currentDirection: string) {
  direction.value = currentDirection;
}

function closeGame() {
  window.parent.postMessage("CLOSE ME");
}

function reset() {
  playSound(clickSoundSource);
  submitted = false;
}

function playSound(pathToAudioFile: string){
  const sound = new Audio(pathToAudioFile);
  sound.play();
}

async function handleCloseGame() {
  await playSound(clickSoundSource);
    setTimeout(() => {
      closeGame();
    }, 500);
}
</script>

<template>
  <div class="container">
    <div>
      <div class="row">
        <div class="col-9">
          <div
              class="m-0 p-0 crosswordRow"
              v-for="crosswordRow in crosswordpuzzle"
              :key="crosswordRow"
          >
            <div
                class="crosswordTile m-0 p-0"
                v-for="crosswordTile in crosswordRow"
                :key="crosswordTile"
            >
              <InputField
                  :crossword="crosswordpuzzle"
                  :crosswordTile="crosswordTile"
                  :direction="direction"
                  @direction="setDirection"
              />
            </div>
          </div>
        </div>

        <div class="col-3">
          <ol class="list-group list-group-flush list-group-numbered">
            <h1>Questions</h1>
            <li
                v-for="question in questions"
                class="list-group-item"
                :key="question"
            >
              {{ question.questionText }}
            </li>
          </ol>
          <button
              id="evaluate-button"
              class="btn btn-primary m-3"
              @click="evaluateSolution()"
          >
            Evaluate
          </button>
        </div>
      </div>
    </div>
  </div>

  <div ref="evaluationModal" class="modal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ evaluationModalContext.title }}</h5>
        </div>
        <div class="modal-body">
          <p v-html="evaluationModalContext.text" class="nice-font"></p>
        </div>
        <div class="modal-footer">
          <router-link :to="{ name: 'home' }">
            <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @click="reset"
            >
              Retry minigame
            </button>
          </router-link>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="handleCloseGame"
          >
            Close minigame
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.crosswordTile {
  white-space: nowrap;
  display: inline-block;
}

.crosswordRow {
  height: 45px;
}


 .gold-text {
   color: gold;
   font-weight: bold;
 }

.nice-font {
  font-family: 'Arial', sans-serif;
}

</style>


