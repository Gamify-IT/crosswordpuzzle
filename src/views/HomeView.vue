<script setup lang="ts">
import { generateCrossword } from "@/crosswordgenerator";
import type { question } from "@/types/index";

let quest1: question = {
  answer: "Syntax",
  question: "Testquestion1"
};
let quest2: question = {
  answer: "for-schleife",
  question: "Testquestion2"
};
let quest3: question = {
  answer: "typescript",
  question: "Testquestion3"
};
let questions = [quest1, quest2, quest3];

const crosswordpuzzle = generateCrossword(questions);

</script>

<template>
  <main>
    <router-link class="btn btn-primary position-absolute top-50 start-50 translate-middle"
      :to="{ name: 'crosswordpuzzle', params: { crosswordpuzzle: crosswordpuzzle, questions: questions } }" role="button">Start</router-link>


  </main>
</template>

<style scoped>
</style>