<script setup lang="ts">
import TheWelcome from "@/components/TheWelcome.vue";
import { generateCrossword } from "@/crosswordgenerator";
import type { question } from "@/types/index";
import type { tileCrossWord} from "@/types/index";

let quest1 = {
  answer: "Syntax",
  question: "Testquestion1"
};
let quest2 = {
  answer: "for-schleife",
  question: "Testquestion2"
};
let quest3 = {
  answer: "typescript",
  question: "Testquestion3"
};
let questions = [quest1,quest2,quest3];
generateCrossword(questions);
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
