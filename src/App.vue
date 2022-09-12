<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref } from "vue";

let closeModal = ref(false);

function closeGame() {
  window.parent.postMessage("CLOSE ME");
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
        @click="closeModal = true"
      >
        Close
      </b-button>
    </nav>
  </header>
  <RouterView />
  <b-modal v-model="closeModal" title="Close Minigame" @ok="closeGame">
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
