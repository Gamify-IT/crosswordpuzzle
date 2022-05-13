<script setup lang="ts">
import { generateCrossword } from "@/crosswordgenerator";
import Field from "@/components/Field.vue";
import type { tileCrossWord } from "@/types/index";
import type { question } from "@/types/index";

const props = defineProps<{
  questions: question[];
}>();

let quest1: question = {
  answer: "Syntax",
  question:
    "System von Regeln, nach denen wohlgeformte Ausdrücke gebildet werden",
};
let quest2: question = {
  answer: "for-schleife",
  question:
    "Bei welcher Schleife kann man die Anzahl der durchläufe im Schleifeenkopf festlegen?",
};
let quest3: question = {
  answer: "typescript",
  question: "What is js with type safety?",
};
const questions = [quest1, quest2, quest3];

const crosswordpuzzle = await generateCrossword(questions);
console.log(crosswordpuzzle);

function evaluateSolution() {
  let isCorrect = true;
  checkLoop: crosswordpuzzle.forEach(crosswordRow => {
    crosswordRow.forEach(element => {
      if (element.currentLetter != element.answer) {
        isCorrect = false;
      }
    })
  })
  console.log(isCorrect);
}

</script>

<template>
  <div class="crosswordpuzzle container">
    <div class="row">
      <div class="col-9">
        <div class="container my-4">
          <div
            class="row row-cols-auto m-0 p-0"
            v-for="(crosswordRow, indexColumn) in crosswordpuzzle"
          >
            <div
              class="col m-0 p-0"
              v-for="(crosswordTile, indexRow) in crosswordRow"
            >
              <Field :crosswordTile="crosswordTile" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-3">
        <ol class="list-group list-group-flush list-group-numbered">
          <h1>Fragen</h1>
          <li v-for="question in questions" class="list-group-item">
            {{ question.question }}
          </li>
        </ol>
        <button class="btn btn-primary m-3" @click="evaluateSolution()">Evaluate</button>

      </div>
    </div>
  </div>



  <div class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>
.crosswordpuzzle {
  white-space: nowrap;
}
</style>
