<script lang="ts">
import { defineComponent } from 'vue';
import Field from "@/components/Field.vue";

interface tileCrossWord {
    answer: string;
    currentLetter: string;
    startPoint: boolean;
    startDirection: string;
}

export default defineComponent({
    name: "Crosswordpuzzle",
    components: {
        Field
    },
    props: {
        crosswordpuzzle: Array
    
  }
});




</script>

<template>

<div class="container">
  <div class="row row-cols-auto" v-for="crosswordRow in crosswordpuzzle">
    <div class="col" v-for="crosswordTile in crosswordRow">
        <Field crosswordTile="crosswordTile" />
    </div>
  </div>
</div>

</template>



<style>
</style>
