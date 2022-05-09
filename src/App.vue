<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Crosswordpuzzle</span>
      </div>
    </nav>

  </header>
  <Suspense>
    <RouterView />
  </Suspense>
  
</template>

<style>
@import "@/assets/base.css";

</style>
