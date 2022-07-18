<script setup lang="ts">
import type { Question } from "@/types/index";
import questionsJson from "@/assets/questions.json";
import axios from "axios";
import { useRoute } from "vue-router";
import config from "@/config";
import { ref } from "vue";
import { useStore } from "@/store";

let questions = ref(Array<Question>());

const store = useStore();

const route = useRoute();
const configuration = route.hash;
console.log(configuration);
if (configuration == "") {
  questions.value = store.state.questions;
  console.log(questions);
  console.log("default");
} else {
  let configWithoutHash = configuration.slice(1);
  console.log(configWithoutHash);
  axios
    .get(`${config.apiBaseUrl}/questions/` + configWithoutHash)
    .then((response) => {
      questions.value = response.data;
    })
    .then(() => {
      store.commit("setQuestions", questions);
      console.log(questions.value);
    });
}
</script>

<template>
  <main>
    <div class="crosswordpuzzle container">
      <div class="row">
        <div class="col-8">
          <ol class="list-group list-group-flush list-group-numbered">
            <h1>Questions</h1>
            <li
              v-for="question in questions"
              class="list-group-item"
              :key="question"
            >
              {{ question.question }}
              <small>{{ question.answer }}</small>
            </li>
          </ol>
        </div>

        <div class="col-4 position-relative">
          <router-link
            id="start-button"
            class="btn btn-primary position-absolute top-50 start-50 translate-middle"
            :to="{ name: 'crosswordpuzzle' }"
            role="button"
            >Start</router-link
          >
        </div>
      </div>
    </div>
  </main>
</template>
