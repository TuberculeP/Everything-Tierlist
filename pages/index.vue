<template>
  <div class="the-tierlist">
    <Tierlist :items="data?.items" />
  </div>
</template>

<script lang="ts" setup>
const { data, refresh } = await useFetch("/api/items/all");
</script>

<style>
.the-tierlist {
  margin-top: 20px;
  width: 100%;
}
</style>
