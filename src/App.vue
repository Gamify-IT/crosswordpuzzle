<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";
import backgroundMusicSource from '/src/assets/music/background_music.mp3';
import clickSoundSource from '/src/assets/music/click_sound.mp3';
let closeModal = ref(false);
const clickSound = new Audio(clickSoundSource);
const backgroundMusic = new Audio(backgroundMusicSource);

function closeGame() {
  window.parent.postMessage("CLOSE ME");
}

function playClickSound(){
  clickSound.play();
}

onMounted(() => {
  backgroundMusic.play();
  backgroundMusic.loop = true;
});

onUnmounted(() => {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
});

async function handleCloseGame() {
  await playClickSound();
    setTimeout(() => {
      closeGame();
    }, 500);
}
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Crosswordpuzzle</span>
      </div>
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
  <RouterView />
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
