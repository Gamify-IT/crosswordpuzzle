<script setup lang="ts">
import type { question } from "@/types/index";
import questionsJson from "@/assets/questions.json";

const questions: question[] = questionsJson;

</script>

<template>
  <main>
    <div class="crosswordpuzzle container">
      <div class="row">
        <div class="col-8">
          <ol class="list-group list-group-flush list-group-numbered">
            <h1>Questions</h1>
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
