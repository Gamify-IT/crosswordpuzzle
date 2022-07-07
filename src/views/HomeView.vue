<script setup lang="ts">
import type { question } from "@/types/index";
import questionsJson from "@/assets/questions.json";
import axios from "axios";
import { useRoute } from 'vue-router';
import config from "@/config";

let questions: question[];
questions = [];

const route = useRoute();
const configuration = route.params.id;
console.log(configuration)
if(configuration == "default"){
  questions = questionsJson;
}else{
  axios.get(`${config.apiBaseUrl}/questions/`+configuration)
  .then((response) => {
      let currentQuestions: question[];
      currentQuestions = response.data
      currentQuestions.forEach(quest => {
        questions.push({
          question: quest.question,
          answer: quest.answer
        })
      });
      questions = response.data;
  }).then(()=>{
    localStorage.setItem('questions',JSON.stringify(questions))
    console.log(questions)
  })
}
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
