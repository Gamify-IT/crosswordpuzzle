<script setup lang="ts">
import { generateCrossword } from "@/crosswordgenerator";
import type { question } from "@/types/index";
import type { tileCrossWord } from "@/types/index";

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
</script>

<template>
  <main>
    <div class="crosswordpuzzle container">
      <div class="row">
        <div class="col-8">
          <ol class="list-group list-group-flush list-group-numbered">
            <h1>Fragen</h1>
            <li v-for="question in questions" class="list-group-item">
              {{ question.question }}
              <small>{{ question.answer }}</small>
            </li>
          </ol>
        </div>

        <div class="col-4 position-relative">
          <router-link
            class="btn btn-primary position-absolute top-50 start-50 translate-middle"
            :to="{ name: 'crosswordpuzzle'}"
            role="button"
            >Start</router-link
          >
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
