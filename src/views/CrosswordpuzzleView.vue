<script setup lang="ts">
import { generateCrossword } from "@/crosswordgenerator";
import { ref } from "vue";
import { Modal } from "bootstrap";
import InputField from "@/components/InputField.vue";
import type { Question } from "@/types";
import { store } from "@/store/index";

const evaluationModal = ref(null);

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
  crosswordpuzzle.forEach((crosswordRow) => {
    crosswordRow.forEach((element) => {
      const charsAreEqual =
        element.currentLetter.toUpperCase() != element.answer.toUpperCase();
      if (charsAreEqual && !element.startPoint) {
        isCorrect = false;
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
  const modal = new Modal(evaluationModal.value);
  modal.show();
}
</script>

<template>
  <div class="container">
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
            <InputField :crosswordTile="crosswordTile" />
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
            {{ question.question }}
          </li>
        </ol>
        <button id="evaluate-button" class="btn btn-primary m-3" @click="evaluateSolution()">
          Evaluate
        </button>
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
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <router-link :to="{ name: 'home' }">
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Back to welcome page
            </button>
          </router-link>
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
