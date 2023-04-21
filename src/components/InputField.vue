<script setup lang="ts">
import { defineProps, nextTick, ref, watch } from "vue";
import type { TileCrossWord } from "@/types";

const emptyTileString = "empty";

const props = defineProps<{
  crosswordTile: TileCrossWord;
  direction: string;
  crossword: TileCrossWord[][];
}>();

const emit = defineEmits<{
  (e: "direction", direction: string): void;
}>();

const crosswordTile = ref(props.crosswordTile);

const direction = ref("");

const crossword = ref(props.crossword);

watch(
  () => props.crossword,
  (newCrossword) => {
    crossword.value = newCrossword;
  },
  { deep: true }
);

watch(
  () => props.crosswordTile,
  (newCrosswordTile) => {
    crosswordTile.value = newCrosswordTile;
  },
  { deep: true }
);

watch(
  () => props.direction,
  (currentDirection) => {
    direction.value = currentDirection;
  },
  { deep: true }
);

async function keyDown(key: KeyboardEvent) {
  if (key.key.length == 1) {
    crosswordTile.value.currentLetter = key.key.toUpperCase();
    let elementRight = document.getElementById(
      "inputField:x" +
        (crosswordTile.value.positionX + 1) +
        ",y" +
        crosswordTile.value.positionY
    );
    let elementDown = document.getElementById(
      "inputField:x" +
        crosswordTile.value.positionX +
        ",y" +
        (crosswordTile.value.positionY + 1)
    );
    if (direction.value == "right") {
      if (elementRight != null) {
        elementRight.focus();
      } else {
        emit("direction", "");
      }
    }
    if (direction.value == "down") {
      if (elementDown != null) {
        elementDown.focus();
      } else {
        emit("direction", "");
      }
    }
    if (direction.value == "") {
      if (elementRight != null) {
        console.log("right");
        console.log(
          crossword.value[crosswordTile.value.positionY][
            crosswordTile.value.positionX + 1
          ].currentLetter.length
        );
        if (
          crossword.value[crosswordTile.value.positionY][
            crosswordTile.value.positionX + 1
          ].currentLetter.length == 0
        ) {
          console.log("right empty");
          elementRight.focus();
          emit("direction", "right");
        } else {
          if (elementDown != null) {
            elementDown.focus();
            emit("direction", "down");
          } else {
            elementRight.focus();
            emit("direction", "right");
          }
        }
      } else if (elementDown != null) {
        elementDown.focus();
        emit("direction", "down");
      }
    }
  } else {
    switch (key.key) {
      case "ArrowRight": {
        pressRightArrow();
        break;
      }
      case "ArrowLeft": {
        pressLeftArrow();
        break;
      }
      case "ArrowDown": {
        pressDownArrow();
        break;
      }
      case "ArrowUp": {
        pressUpArrow();
        break;
      }
    }
  }

  function pressLeftArrow() {
    let elementDown = null;
    let currentX = crosswordTile.value.positionX - 1;
    while (elementDown == null) {
      elementDown = document.getElementById(
        "inputField:x" + currentX + ",y" + crosswordTile.value.positionY
      );
      if (currentX > 0) {
        currentX--;
      } else {
        currentX = crossword.value.length;
      }
    }
    elementDown.focus();
  }

  function pressRightArrow() {
    let elementDown = null;
    let currentX = crosswordTile.value.positionX + 1;
    while (elementDown == null) {
      elementDown = document.getElementById(
        "inputField:x" + currentX + ",y" + crosswordTile.value.positionY
      );
      if (currentX < crossword.value.length) {
        currentX++;
      } else {
        currentX = 0;
      }
    }
    elementDown.focus();
  }

  function pressUpArrow() {
    let elementDown = null;
    let currentY = crosswordTile.value.positionY - 1;
    while (elementDown == null) {
      elementDown = document.getElementById(
        "inputField:x" + crosswordTile.value.positionX + ",y" + currentY
      );
      if (currentY > 0) {
        currentY--;
      } else {
        currentY = crossword.value[0].length;
      }
    }
    elementDown.focus();
  }

  function pressDownArrow() {
    let elementDown = null;
    let currentY = crosswordTile.value.positionY + 1;
    while (elementDown == null) {
      elementDown = document.getElementById(
        "inputField:x" + crosswordTile.value.positionX + ",y" + currentY
      );
      if (currentY < crossword.value[0].length) {
        currentY++;
      } else {
        currentY = 0;
      }
    }
    elementDown.focus();
  }
}
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
        v-if="crosswordTile.startDirection === 'right'"
        src="@/assets/caret-right.svg"
        class="arrowRight"
        alt="right arrow"
      />

      <img
        v-else-if="crosswordTile.startDirection === 'down'"
        src="@/assets/caret-right.svg"
        class="arrowDown"
        alt="down arrow"
      />
    </div>

    <input
      v-else-if="crosswordTile.currentLetter !== emptyTileString"
      class="form-control text-center"
      autocomplete="off"
      type="text"
      maxlength="1"
      @keydown="keyDown"
      @keydown.prevent
      :id="
        `inputField:x` +
        crosswordTile.positionX +
        `,y` +
        crosswordTile.positionY
      "
      v-model="crosswordTile.currentLetter"
      @focus="$event.target.select()"
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
