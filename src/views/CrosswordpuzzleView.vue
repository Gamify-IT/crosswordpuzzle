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
import clickSoundSource from "@/assets/music/click_sound.mp3";
import successSoundSource from "@/assets/music/success_sound.mp3";
import errorSoundSource from "@/assets/music/error_sound.mp3";
import {createAudioWithVolume} from "@/ts/volumeLevelChange"

const evaluationModal = ref();
const direction = ref("");
const showResultsModal = ref(false);
let submitted = false;
const time = Date.now();


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
const results = ref<any[]>([]);
const answersResultTable = ref<GameAnswer[]>([]);
/**
 * Retrieves both vertical and horizontal incorrect answers for a given crossword tile.
 *
 * @param element The crossword tile element that was filled incorrectly.
 * @returns An array containing the incorrect answers for both vertical and horizontal directions.
 */
function getWrongQuestion(element: TileCrossWord): QuestionAnswer[] {
  return [
    getWrongQuestionVertical(element),
    getWrongQuestionHorizontal(element),
  ];
}

/**
 * Retrieves the incorrect horizontal answer for a given crossword tile.
 *
 * The method traverses the crossword row to find the horizontal answer that starts from the given tile.
 *
 * @param element The crossword tile element.
 * @returns An object containing the question number and the incorrect answer.
 */
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

/**
 * Retrieves the incorrect vertical answer for a given crossword tile.
 *
 * The method traverses the crossword column to find the vertical answer that starts from the given tile.
 *
 * @param element The crossword tile element.
 * @returns An object containing the question number and the incorrect answer.
 */
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

/**
 * Evaluates the player's crossword puzzle solution.
 *
 * This function checks each tile of the crossword puzzle and compares it to the correct answer.
 * If the answer is correct, it is added to the correct answers set, otherwise it is added to the incorrect answers set.
 * It also calculates the score, rewards, and shows the result in a modal at the end.
 */
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
              answer: wrongQuestion.answer,
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
  answersResultTable.value = Array.from(answers);

  const gameResult: GameResult = {
    correctTiles: numberOfTiles - wrongTiles,
    numberOfTiles: numberOfTiles,
    configuration: configuration,
    answers: Array.from(answers),
    duration: (Date.now() - time) / 1000,
    score: parseFloat((((numberOfTiles - wrongTiles) / numberOfTiles) * 100).toFixed(2)),
    rewards: 0
  };

  if (!submitted) {
    try {
      await submitGameResult(gameResult);
      let rewards = storeTwo.state.rewards;
      let score = gameResult.score;
      let scoreText = `<span class="gold-text">${score} scores</span>`;
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

/**
 * Displays the results of the crossword game in a modal.
 *
 * This function processes the answers stored in the `answersResultTable`,
 * formats them into a readable structure, and then displays them in a modal.
 */
function showResults() {
  results.value = [];

  answersResultTable.value.forEach((answer) => {
    results.value.push({
      question: answer.question,
      yourAnswer: answer.answer,
      correct: answer.correct ? "Correct" : "Incorrect",
    });
  });
  showResultsModal.value = true;
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
  const sound = createAudioWithVolume(pathToAudioFile);
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
  <!-- Main container for the crossword puzzle and questions. -->
  <div class="container">
    <div class="row">
      <div class="col-9 crossword-horizontal-content">
          <div class="scrollable-content content" >
            <div class="m-0 p-0 crosswordRow" v-for="crosswordRow in crosswordpuzzle" :key="crosswordRow">
              <!-- Loop through tiles in each row and render InputField component. -->
              <div class="crosswordTile m-0 p-0" v-for="crosswordTile in crosswordRow" :key="crosswordTile">
                <InputField
                    :crossword="crosswordpuzzle"
                    :crosswordTile="crosswordTile"
                    :direction="direction"
                    @direction="setDirection"
                />
              </div>
            </div>
          </div>
      </div>

      <!-- Column displaying questions (3 parts wide). -->
      <div class="col-3">
        <h1>Questions</h1>
        <!-- Button to evaluate the puzzle solution. -->
        <button id="evaluate-button" class="btn btn-primary m-3" @click="evaluateSolution()">
          Evaluate
        </button>
        <div class="scrollable-content content question-content">
        <!-- Ordered list of questions in the crossword puzzle. -->
        <ol class="list-group list-group-flush list-group-numbered">
          <!-- Loop through each question and display it in the list. -->
          <li
              v-for="question in questions"
              class="list-group-item"
              :key="question"
          >
            {{ question.questionText }}
          </li>
        </ol>
      </div>
      </div>
    </div>
  </div>

  <!-- Modal that shows the evaluation result of the game. -->
  <div ref="evaluationModal" class="modal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal header with the evaluation title. -->
        <div class="modal-header">
          <h5 class="modal-title">{{ evaluationModalContext.title }}</h5>
        </div>
        <!-- Modal body with the evaluation result text. -->
        <div class="modal-body">
          <p v-html="evaluationModalContext.text" class="nice-font"></p>
        </div>
        <!-- Modal footer with action buttons. -->
        <div class="modal-footer">
          <!-- Button to retry the minigame (navigate to home). -->
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
          <!-- Button to close the game. -->
          <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="handleCloseGame"
          >
            Close minigame
          </button>
          <button
              type="button"
              class="btn btn-info"
              @click="showResults">See results</button>

        </div>
      </div>
    </div>
  </div>

  <!-- Results Modal: Display the results in a table -->
  <div v-if="showResultsModal" class="modal fade show" tabindex="-1" style="display: block;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Let's see how you did!</h5>
        </div>
        <div class="modal-body">
          <!-- Table displaying the results of the puzzle. -->
          <table class="table">
            <thead>
            <tr>
              <th>QUESTION:</th>
              <th>RESULT:</th>
            </tr>
            </thead>
            <tbody>
            <!-- Loop through the results array and display each result in the table. -->
            <tr v-for="(result, index) in results" :key="index">
              <td>{{ result.question }}</td>
              <td :class="result.correct === 'Correct' ? 'text-success fw-bold' : 'text-danger fw-bold'">
                <!-- Display whether the answer is correct or incorrect. -->
                {{ result.correct }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- Modal footer with a button to close the results modal. -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showResultsModal = false">Close</button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
/* .crosswordTile: Ensures tiles are inline-block and prevents text from wrapping. */
.crosswordTile {
  white-space: nowrap;
  display: inline-block;
}
/* .crosswordRow: Sets a fixed height for each row of the crossword puzzle. */
.crosswordRow {
  height: 45px;
  white-space: nowrap;
}
/* .gold-text: Styles text in gold color and bold for emphasis. */
.gold-text {
  color: gold;
  font-weight: bold;
}
/* .nice-font: Applies a clean and simple font (Arial) for text in the modal. */
.nice-font {
  font-family: 'Arial', sans-serif;
}

/* Table Styles */
.table {
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin-top: 20px;
}

/* Table Header */
.table thead {
  background-color: #007bff;
  color: white;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1.1rem;
}

/* Table Body */
.table tbody tr {
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

.table tbody tr:nth-child(even) {
  background-color: #e9ecef;
}

.table td {
  padding: 15px 20px;
  text-align: center;
  font-size: 1rem;
  vertical-align: middle;
}

.text-success {
  color: #28a745;
  font-weight: bold;
}

.text-danger {
  color: #dc3545;
  font-weight: bold;
}

.table tbody tr:hover td {
  color: #495057;
}

.text-success:before {
  content: "✅️";
  margin-right: 10px;
}

.text-danger:before {
  content: "❌";
  margin-right: 10px;
}

/* Table Footer Button Styles */
.modal-footer .btn {
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  font-weight: bold;
  padding: 8px 16px;
  border: none;
  transition: background-color 0.2s ease-in-out;
}


.content {
  margin: 10px;
}

.scrollable-content {
  background: #ffffff;
  flex-grow: 1;
  height: 90vh;
  overflow-y: auto;

  /* for Firefox */
  min-height: 0;
}

.question-content {
  height: 77vh;
}

.crossword-horizontal-content {
  overflow-x: auto;
}

#box {

}
</style>