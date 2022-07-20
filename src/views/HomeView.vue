<script setup lang="ts">
import type { Question } from "@/types/index";
import axios from "axios";
import { useRoute } from "vue-router";
import config from "@/config";
import { ref } from "vue";
import { store } from "@/store/index";
import questionsJson from "@/assets/questions.json";

let questions = ref(Array<Question>());

let errorText = ref("");

let isActive = ref(false);

const route = useRoute();

const configuration = route.params.id;
console.log(configuration);
if (configuration == "default") {
  store.commit("setQuestions", questionsJson);
  questions.value = questionsJson;
  isActive.value = true;
} else {
  axios
    .get(`${config.apiBaseUrl}/questions/` + configuration)
    .then((response) => {
      questions.value = response.data;
      store.commit("setQuestions", questions);
      isActive.value = true;
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        isActive.value = false;
        if (error.response.status == 404) {
          errorText.value = "the selected configuration was not found";
        } else {
          errorText.value = error;
        }
      }
    });
}
</script>

<template>
  <main>
    <div class="alert alert-danger" v-if="errorText">
      A fatal error occured: <br />
      {{ errorText }} <br />
      please report the error to an admin.
    </div>
    <div class="crosswordpuzzle container" v-if="isActive">
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
