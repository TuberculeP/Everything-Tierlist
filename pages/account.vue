<template>
  <div>
    <pre>{{ myItems }}</pre>
  </div>
</template>

<script lang="ts" setup>
const { data: myItems } = await useFetch("/api/items/from-user");
</script>

<style></style>
