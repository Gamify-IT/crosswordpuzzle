<script setup lang="ts">
/**
 * Fetches crossword puzzle questions based on the configuration, handles errors,
 * and manages sound effects for user interaction.
 */

import type { Question } from "@/types";
import axios from "axios";
import { useRoute } from "vue-router";
import config from "@/config";
import { ref } from "vue";
import { store } from "@/store";
import questionsJson from "@/assets/questions.json";
import clickSoundSource from "@/assets/music/click_sound.mp3";
import {fetchVolumeLevel, createAudioWithVolume} from "@/ts/volumeLevelChange"

let questions = ref(Array<Question>());

let errorText = ref("");

let isActive = ref(false);

const route = useRoute();
let clickSound: HTMLAudioElement;

const configuration = route.params.id as string;
if (configuration == "default") {
  store.commit("setQuestions", questionsJson);
  questions.value = questionsJson;
  isActive.value = true;
} else {
  axios
    .get(`${config.apiBaseUrl}/configurations/` + configuration + '/volume')
    .then((response) => {
      fetchVolumeLevel(configuration);
      questions.value = response.data.questions;
      if (questions.value.length === 0) {
        errorText.value = "There are no questions in this game.";
      } else {
        store.commit("setQuestions", questions);
        isActive.value = true;
      }
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        isActive.value = false;
        if (error.response.status == 404) {
          errorText.value = "The selected configuration was not found";
        } else {
          errorText.value = error;
        }
      }
    }); 
}

/**
 * Function to play a click sound when a button is clicked
 */
function playClickSound(){
  clickSound = createAudioWithVolume(clickSoundSource);
  clickSound.play();
}
</script>

<template>
  <main>
    <!-- Display an error message if errorText is not empty -->
    <div class="alert alert-danger" v-if="errorText">
      A fatal error occurred: <br />
      {{ errorText }} <br />
      Please report the error to an admin.
    </div>
    <!-- Display crossword puzzle questions if isActive is true -->
    <div class="crosswordpuzzle container" v-if="isActive">
      <div class="row">
        <!-- Column displaying the list of questions -->
        <div class="col-8">
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
        </div>
        <!-- Column with a button to start the crossword puzzle -->
        <div class="col-4 position-relative">
          <router-link
            id="start-button"
            class="btn btn-primary position-absolute top-50 start-50 translate-middle"
            :to="{ name: 'crosswordpuzzle' }"
            role="button"
            @click="playClickSound()"
            >Start</router-link
          >
        </div>
      </div>
    </div>
  </main>
</template>
