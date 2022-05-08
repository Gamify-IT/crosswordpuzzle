<script setup lang="ts">
import type { tileCrossWord } from "@/types/index";
import type { question } from "@/types/index"

defineProps<{
  crosswordpuzzle: tileCrossWord[][];
  questions: question[];
}>();
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import Field from "@/components/Field.vue";

export default defineComponent({
  name: "Crosswordpuzzle",
  components: {
    Field
  }
});




</script>

<template>
  <div class="container">
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
        <ol class="list-group">
          <h1>Fragen</h1>
        </ol>
        <ol v-for="question in questions" class="list-group list-group-numbered">
          {{ question.question }}
        </ol>
      </div>
    </div>
  </div>

</template>



<style>
</style>
