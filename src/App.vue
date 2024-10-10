<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import backgroundMusicSource from "@/assets/music/background_music.mp3";
import clickSoundSource from "@/assets/music/click_sound.mp3";
import { VolumeLevelDTO } from "./types/dtos";
import axios from "axios";
import config from "@/config";

let closeModal = ref(false);
let clickSound =  new Audio(clickSoundSource);
let backgroundMusic =  new Audio(backgroundMusicSource);
let volumeLevel : number | null = 0;

const route = useRoute();

const fetchVolumeLevel = async (configuration: string) => {
  try {
    const response = await axios.get<VolumeLevelDTO>(
      `${config.apiBaseUrl}/configurations/${configuration}/volume`
    );
    volumeLevel = response.data.volumeLevel;
    if (volumeLevel == 2 || volumeLevel == 3) {
      volumeLevel = 1;
    } else if (volumeLevel == 1) {
      volumeLevel = 0.5;
    }
    clickSound.volume = volumeLevel !== null ? volumeLevel : 1;
    backgroundMusic.volume = volumeLevel !== null ? volumeLevel : 1;
  } catch (error) {
    console.error('Error fetching volume level:', error);
  }
};
watch(() => route.params.id, async (newId) => {
  if (newId && typeof newId === 'string') {
    await fetchVolumeLevel(newId);
  } else {
    console.log('Invalid configuration parameter');
  }
}, { immediate: true });

onMounted(() => {
  backgroundMusic.volume = 0;
  backgroundMusic.play();
  backgroundMusic.loop = true;
});

onUnmounted(() => {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
});

/**
 * Function to handle closing the game
 */
async function handleCloseGame() {
  await playClickSound();
    setTimeout(() => {
      closeGame();
    }, 500);
}

/**
 * Function to send a message to the parent window to close the game
 */
function closeGame() {
  window.parent.postMessage("CLOSE ME");
}

function playClickSound(){
  clickSound.play();
}
</script>

<template>
  <header>
    <!-- Navigation bar with the game title -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Crosswordpuzzle</span>
      </div>
      <!-- Close button that triggers a modal when clicked -->
      <b-button
        variant="danger"
        class="close-button"
        id="close-button"
        @click="closeModal = true; playClickSound()"
      >
        Close
      </b-button>
    </nav>
  </header>
  <!-- Router view for rendering nested views -->
  <RouterView />
  <!-- Modal dialog that asks the user to confirm before closing the game -->
  <b-modal v-model="closeModal" title="Close Minigame" @ok="handleCloseGame" @cancel="playClickSound">
    <p class="my-4">The game will be closed without evaluation.</p>
  </b-modal>
</template>
<style>
.modal-backdrop {
  z-index: 1050;
}
.modal-content {
  z-index: 1100;
}
</style>
