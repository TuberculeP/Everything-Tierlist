<template>
  <div>
    <h1>Account</h1>
    <h3>Manage your added items</h3>
    <ul>
      <li class="search">
        <input
          type="text"
          placeholder="Search for items ..."
          v-model="search"
        />
      </li>
      <li :key="i + name + id" v-for="({ name, id }, i) in filteredItems">
        <p>{{ name }}</p>
        <button @click="removeItem(id)">
          <Icon name="mdi:close-circle" color="black" />
        </button>
      </li>
    </ul>
    <p class="total">{{ data?.items?.length }} items</p>
    <h3>Add new items</h3>
    <div class="new-item">
      <input
        type="text"
        v-model="newItemName"
        placeholder="New item name ..."
      />
      <button @click="sendNewItem">Send new</button>
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
const filteredItems = computed(() => {
  return _.orderBy(
    data.value?.items?.filter((item) =>
      item.name.toLowerCase().includes(search.value.toLowerCase())
    ),
    "id",
    "desc"
  );
});

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
h1 {
  margin-bottom: 20px;
}
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
