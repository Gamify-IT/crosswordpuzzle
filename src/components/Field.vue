<script setup lang="ts">
import type { TileCrossWord } from "@/types/index";

const emptyTileString = "empty";

defineProps<{
  crosswordTile: TileCrossWord;
}>();
</script>

<template>
  <div class="field p-0 m-0">
    <div v-if="crosswordTile.startPoint" class="p-0 m-0">
      <span
        class="badge rounded-pill bg-dark position-absolute top-50 start-50 translate-middle"
      >
        {{ crosswordTile.answer }}
      </span>

      <img
        v-if="crosswordTile.startDirection == 'right'"
        src="@/assets/caret-right.svg"
        class="arrowRight"
        alt="right arrow"
      />

      <img
        v-else-if="crosswordTile.startDirection == 'down'"
        src="@/assets/caret-right.svg"
        class="arrowDown"
        alt="down arrow"
      />
    </div>

    <input
      v-else-if="crosswordTile.currentLetter != emptyTileString"
      class="form-control text-center"
      type="text"
      maxlength="1"
      v-model="crosswordTile.currentLetter"
    />
  </div>
</template>

<style scoped>
.field {
  width: 45px;
  height: 45px;
  position: relative;
}

.arrowRight {
  translate: 0 -50%;
  position: absolute;
  top: 50%;
  left: 70%;
}

.arrowDown {
  translate: -50% 0;
  transform: rotate(90deg);
  position: absolute;
  top: 70%;
  left: 50%;
}

input {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}
</style>
