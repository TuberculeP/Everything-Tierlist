<template>
  <div>
    <h1>Account</h1>
    <div class="border border-gray-200 p-4">
      <div class="flex justify-between gap-5">
        <UInput
          icon="i-heroicons-magnifying-glass-20-solid"
          v-model="search"
          :placeholder="`Search in ${filteredItems.length} items...`"
        />
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="filteredItems.length"
        />
      </div>
      <UTable
        :rows="slicedItems"
        v-model="selectedItems"
        @select="selectItem"
      />
      <UDivider class="pb-5" />
      <div class="flex gap-4">
        <UInput
          icon="i-heroicons-plus"
          v-model="newItemName"
          placeholder="New item name ..."
        />
        <UButton @click="sendNewItem">Send new</UButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import _ from "lodash";
const { data, refresh } = await useFetch("/api/items/from-user");
const { start, finish } = useLoadingIndicator({
  duration: 2000,
  throttle: 200,
});
const search = ref("");
const page = ref(1);
const pageCount = 5;
const filteredItems = computed(() => {
  return _.orderBy(
    data.value?.items?.filter((item) =>
      item.name.toLowerCase().includes(search.value.toLowerCase())
    ),
    "id",
    "desc"
  );
});

const slicedItems = computed(() =>
  filteredItems.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  )
);

const selectedItems = ref<any[]>([]);

function selectItem(row: any) {
  const index = selectedItems.value.findIndex((item) => item.id === row.id);
  if (index === -1) {
    selectedItems.value.push(row);
  } else {
    selectedItems.value.splice(index, 1);
  }
}

async function removeItem(id: number) {
  start();
  await $fetch("/api/items/remove", {
    method: "POST",
    body: { id },
  });
  await refresh();
  finish();
}

const newItemName = ref("");
const sendNewItem = async () => {
  if (!newItemName.value) return;
  start();
  try {
    await $fetch("/api/items/new", {
      method: "post",
      body: { name: newItemName.value },
    });
    newItemName.value = "";
    await refresh();
  } catch (e) {
    console.error(e);
  }
  finish();
};
</script>

<style scoped lang="scss">
ul {
  list-style: none;
  margin: 20px 0 0;
  border: 1px solid gray;
  border-radius: 10px;
  height: 300px;
  overflow: scroll;
  position: relative;
  li {
    padding: 15px;
    border-bottom: 1px solid gray;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    &:last-child {
      border-bottom: none;
    }
    &:nth-of-type(odd) {
      background-color: rgba(0, 0, 0, 0.05);
    }
    button {
      background: transparent;
      border: none;
      cursor: pointer;
    }
    &.search {
      position: sticky;
      top: 0;
      background-color: white;
      padding: 0;
      z-index: 1;
      input {
        padding: 10px 15px;
        border: none;
        border-radius: 10px 0 0 0;
        outline: none;
      }
    }
  }
}
p.total {
  font-size: 0.8rem;
  text-align: right;
  margin-top: 10px;
}

div.new-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  margin-top: 20px;
  input {
    padding: 10px 15px;
    border: 1px solid gray;
    border-radius: 10px 0 0 10px;
    outline: none;
  }
  button {
    padding: 10px 15px;
    border: none;
    border-radius: 0 10px 10px 0;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
  }
}
</style>
