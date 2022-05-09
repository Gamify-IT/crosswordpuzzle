<script setup lang="ts">
import type { tileCrossWord } from "@/types/index";

defineProps<{
  crosswordTile: tileCrossWord;
}>();
</script>

<template>
  <div class="field">
    <div v-if="crosswordTile.startPoint">
      <span class="badge rounded-pill bg-dark position-absolute top-50 start-50 translate-middle">1</span>

      <div v-if="crosswordTile.startDirection == 'right'"
        class="position-absolute top-50 start-100 translate-middle">
        <div class="arrow arrowRight"></div>
      </div>
      
      <div v-if="crosswordTile.startDirection == 'left'"
        class="position-absolute top-50 start-0 translate-middle">
        <div class="arrow arrowLeft"></div>
      </div>

      <div v-if="crosswordTile.startDirection == 'down'"
        class="position-absolute top-100 start-50 translate-middle">
        <div class="arrow arrowDown"></div>
      </div>

    </div>

    <!-- v-if disabled because crosswordgenerator isn't working correctly -->
    <input v-if="crosswordTile.currentLetter != undefined || true" :placeholder="crosswordTile.currentLetter"
      class="form-control text-center" type="text" maxlength="1">
  </div>
</template>

<style scoped>
.field {
  width: 45px;
  height: 45px;
  position: relative;
  text-align: center;
}

.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

.arrowRight {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.arrowLeft {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.arrowDown {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}

input{
    width: 100%;
    height: 100%;
  }

</style>
