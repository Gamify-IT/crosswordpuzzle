<script setup lang="ts">
import type { tileCrossWord } from "@/types/index";

defineProps<{
  crosswordTile: tileCrossWord;
}>();
</script>

<template>
    <!-- v-if disabled because crosswordgenerator isn't working correctly -->
    <input v-if="crosswordTile.currentLetter != undefined || true" :placeholder="crosswordTile.currentLetter" class="form-control" type="text">
</template>

<style scoped>

  input{
    width: 3em;
    height: 3em;
  }

</style>
