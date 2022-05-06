<script setup lang="ts">
import type { tileCrossWord } from "@/types/index";

defineProps<{
  crosswordpuzzle: tileCrossWord[][];
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

  <div class="container my-4">
    <div class="row row-cols-auto m-0 p-0" v-for="crosswordRow in crosswordpuzzle">
      <div class="col m-0 p-0" v-for="crosswordTile in crosswordRow">
        <Field :crosswordTile="crosswordTile" />
      </div>
    </div>
  </div>

</template>



<style>
</style>
