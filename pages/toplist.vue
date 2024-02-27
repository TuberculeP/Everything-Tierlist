<template>
  <div>
    <h1>Everything Top List</h1>
    <Podium :data="topListData" />
    <div class="toplist">
      <div class="row" v-for="({ name, total_score }, i) in topListData" :key="i + name">
        <p class="top">{{ i + 1 }}</p>
        <p>{{ name }} ({{ total_score }} EP)</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import _ from "lodash";
const { data } = await useFetch<{item_id: string, total_score: number}[]>(
  "/api/items/item-score"
);
const { data: allItems } = await useFetch<Record<string, any>[]>(
  "/api/items/all"
);
console.log(allItems.value);
const topListData = computed(() =>
  data.value && allItems.value
    ? data.value.slice(0, 10).map((item) => ({
        ...item,
        name: _.find(allItems.value, { id: item.item_id })?.name,
      }))
    : []
);
</script>

<style scoped lang="scss">
.toplist {
  margin-top: 30px;
  border: 1px solid gray;
  .row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    padding: 10px;
    border-bottom: 1px solid gray;
    align-items: center;
    &:last-child {
      border-bottom: none;
    }
    &:first-child {
      font-weight: bold;
    }
  }
}
</style>
