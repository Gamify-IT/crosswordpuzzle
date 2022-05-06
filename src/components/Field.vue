<script setup lang="ts">
defineProps<{
  crosswordTile: string;
}>();
</script>

<template>
  <div class="field">
    <input class="form-control" type="text">
  </div>
</template>

<style scoped>

  .field {
    width: 2em;
    height: 2em;
  }

</style>
