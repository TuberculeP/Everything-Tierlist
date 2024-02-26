<template>
  <div>
    <Tierlist :items="data?.items" />
    <input type="text" v-model="newItemName" />
    <button @click="sendNewItem">Send new</button>
  </div>
</template>

<script lang="ts" setup>
const { data, refresh: refreshAllItems } = await useFetch("/api/items/all");
const newItemName = ref("");
const sendNewItem = async () => {
  if (!newItemName.value) return;
  try {
    await $fetch("/api/items/new", {
      method: "post",
      body: { name: newItemName.value },
    });
    newItemName.value = "";
    refreshAllItems();
  } catch (e) {
    console.error(e);
  }
};
</script>

<style></style>
