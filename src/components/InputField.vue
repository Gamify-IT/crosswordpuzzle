<script setup lang="ts">
import { defineProps, nextTick, ref, watch } from "vue";
import type { TileCrossWord } from "@/types";
import { left } from "@popperjs/core";

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

function isLeftStartPoint(): boolean {
  let leftStartPoint = false;
  if (
    crossword.value[crosswordTile.value.positionY][
      crosswordTile.value.positionX - 1
    ].startPoint
  ) {
    leftStartPoint = true;
  }
  return leftStartPoint;
}

function isUpStartPoint(): boolean {
  let upStartPoint = false;
  if (
    crossword.value[crosswordTile.value.positionY - 1][
      crosswordTile.value.positionX
    ].startPoint
  ) {
    upStartPoint = true;
  }
  return upStartPoint;
}

async function keyDown(key: KeyboardEvent) {
  if (key.key.length == 1) {
    crosswordTile.value.currentLetter = key.key.toUpperCase();

    let elementRight = getCrosswordElement(
      crosswordTile.value.positionX + 1,
      crosswordTile.value.positionY
    );
    let elementDown = getCrosswordElement(
      crosswordTile.value.positionX,
      crosswordTile.value.positionY + 1
    );

    let upStartPoint = isUpStartPoint();

    let leftStartPoint = isLeftStartPoint();

    if (upStartPoint && direction.value == "") {
      if (elementDown != null) {
        elementDown.focus();
        emit("direction", "down");
      } else {
        emit("direction", "");
      }
    } else if (leftStartPoint && direction.value == "") {
      if (elementRight != null) {
        elementRight.focus();
        emit("direction", "right");
      } else {
        emit("direction", "");
      }
    } else if (direction.value == "right") {
      if (elementRight != null) {
        elementRight.focus();
      } else {
        emit("direction", "");
      }
    } else if (direction.value == "down") {
      if (elementDown != null) {
        elementDown.focus();
      } else {
        emit("direction", "");
      }
    } else if (direction.value == "") {
      if (elementRight != null) {
        if (
          crossword.value[crosswordTile.value.positionY][
            crosswordTile.value.positionX + 1
          ].currentLetter.length == 0
        ) {
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
    handleButtonPress();
  }

  function handleButtonPress() {
    switch (key.key) {
      case "ArrowRight": {
        pressRightArrow();
        emit("direction", "right");
        break;
      }
      case "ArrowLeft": {
        emit("direction", "right");
        pressLeftArrow();
        break;
      }
      case "ArrowDown": {
        emit("direction", "down");
        pressDownArrow();
        break;
      }
      case "ArrowUp": {
        emit("direction", "down");
        pressUpArrow();
        break;
      }
      case "Tab": {
        pressTab();
        break;
      }
    }
  }

  function pressTab() {
    let elementRight = getCrosswordElement(
      crosswordTile.value.positionX + 1,
      crosswordTile.value.positionY
    );

    let elementLeft = getCrosswordElement(
      crosswordTile.value.positionX - 1,
      crosswordTile.value.positionY
    );

    let elementDown = getCrosswordElement(
      crosswordTile.value.positionX,
      crosswordTile.value.positionY + 1
    );

    let elementUp = getCrosswordElement(
      crosswordTile.value.positionX,
      crosswordTile.value.positionY - 1
    );
    if (key.shiftKey) {
      if (direction.value == "right") {
        if (elementLeft != null) {
          elementLeft.focus();
        }
      } else if (direction.value == "down") {
        if (elementUp != null) {
          elementUp.focus();
        }
      }
    } else {
      if (direction.value == "right") {
        if (elementRight != null) {
          elementRight.focus();
        }
      } else if (direction.value == "down") {
        if (elementDown != null) {
          elementDown.focus();
        }
      }
    }
  }

  function pressLeftArrow() {
    let elementDown = null;
    let currentX = crosswordTile.value.positionX - 1;
    while (elementDown == null) {
      elementDown = getCrosswordElement(
        currentX,
        crosswordTile.value.positionY
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
      elementDown = getCrosswordElement(
        currentX,
        crosswordTile.value.positionY
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
      elementDown = getCrosswordElement(
        crosswordTile.value.positionX,
        currentY
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
      elementDown = getCrosswordElement(
        crosswordTile.value.positionX,
        currentY
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

function mouseDown() {
  emit("direction", "");
}

function getCrosswordElement(x: number, y: number): HTMLElement | null {
  return document.getElementById(`inputField:x${x},y${y}`);
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
      @mousedown="mouseDown"
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
