<script setup lang="ts">
import { generateCrossword } from "@/crosswordgenerator";
import { ref } from "vue";
import { Modal } from "bootstrap";
import InputField from "@/components/InputField.vue";
import { store } from "@/store";
import type { GameResult, Question } from "@/types";
import { useRoute } from "vue-router";
import { submitGameResult } from "@/ts/restClient";

const evaluationModal = ref();
const direction = ref("");

const route = useRoute();
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

function evaluateSolution() {
  let isCorrect = true;
  let wrongTiles = 0;
  let numberOfTiles = 0;
  crosswordpuzzle.forEach((crosswordRow) => {
    crosswordRow.forEach((element) => {
      if (element.currentLetter != "empty" && !element.startPoint) {
        numberOfTiles++;
      }
      const charsAreEqual =
        element.currentLetter.toUpperCase() != element.answer.toUpperCase();
      if (charsAreEqual && !element.startPoint) {
        isCorrect = false;
        wrongTiles++;
      }
    });
  });
  if (isCorrect) {
    evaluationModalContext.value.title = "Congratulations! 🥳";
    evaluationModalContext.value.text = "Everything right!";
  } else {
    evaluationModalContext.value.title = "Not the correct answers";
    evaluationModalContext.value.text = "Maybe the next time";
  }
  const gameResult: GameResult = {
    correctTiles: numberOfTiles - wrongTiles,
    numberOfTiles: numberOfTiles,
    configuration: configuration,
  };
  submitGameResult(gameResult);
  const modal = new Modal(evaluationModal.value);
  modal.show();
}
function setDirection(currentDirection: string) {
  direction.value = currentDirection;
}
function closeGame() {
  window.parent.postMessage("CLOSE ME");
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
  <div ref="evaluationModal" class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ evaluationModalContext.title }}</h5>
        </div>
        <div class="modal-body">
          <p>{{ evaluationModalContext.text }}</p>
        </div>
        <div class="modal-footer">
          <router-link :to="{ name: 'home' }">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              retry minigame
            </button>
          </router-link>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="closeGame"
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
</style>
