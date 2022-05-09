<script setup lang="ts">
import Field from "@/components/Field.vue";
import type { tileCrossWord } from "@/types/index";
import type { question } from "@/types/index"

defineProps<{
  crosswordpuzzle: tileCrossWord[][];
  questions: question[];
}>();
</script>


<template>
  <div class="crosswordpuzzle container">
    <div class="row">

      <div class="col-9">
        <div class="container my-4">
          <div class="row row-cols-auto m-0 p-0" v-for="crosswordRow in crosswordpuzzle">
            <div class="col m-0 p-0" v-for="crosswordTile in crosswordRow">
              <Field :crosswordTile="crosswordTile" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-3">
        <ol class="list-group list-group-flush list-group-numbered">
          <h1>Fragen</h1>
          <li v-for="question in questions" class="list-group-item">
            {{ question.question }}
          </li>
        </ol>
      </div>

    </div>
  </div>

</template>



<style scoped>
.crosswordpuzzle {
  white-space: nowrap;
}
</style>
