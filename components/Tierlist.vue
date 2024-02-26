<template>
  <div>
    <div class="menu" v-if="isEditing">
      <button @click="cancelChanges">Annuler les changements</button>
      <button @click="saveChanges">Sauvegarder</button>
    </div>
    <div class="tierlist">
      <div class="title">
        <h2>S</h2>
      </div>
      <Draggable
        v-model="sortedItems.sTier"
        tag="div"
        class="row"
        group="items"
        item-key="id"
      >
        <template #item="{ element: item }">
          <div class="item">{{ item.name }}</div>
        </template>
      </Draggable>
      <div class="title">
        <h2>A</h2>
      </div>
      <Draggable
        v-model="sortedItems.aTier"
        tag="div"
        class="row"
        group="items"
        item-key="id"
      >
        <template #item="{ element: item }">
          <div class="item">{{ item.name }}</div>
        </template>
      </Draggable>
      <div class="title">
        <h2>B</h2>
      </div>
      <Draggable
        v-model="sortedItems.bTier"
        tag="div"
        class="row"
        group="items"
        item-key="id"
      >
        <template #item="{ element: item }">
          <div class="item">{{ item.name }}</div>
        </template>
      </Draggable>
      <div class="title">
        <h2>C</h2>
      </div>
      <Draggable
        v-model="sortedItems.cTier"
        tag="div"
        class="row"
        group="items"
        item-key="id"
      >
        <template #item="{ element: item }">
          <div class="item">{{ item.name }}</div>
        </template>
      </Draggable>
      <div class="title">
        <h2>D</h2>
      </div>
      <Draggable
        v-model="sortedItems.dTier"
        tag="div"
        class="row"
        group="items"
        item-key="id"
      >
        <template #item="{ element: item }">
          <div class="item">{{ item.name }}</div>
        </template>
      </Draggable>
      <div class="title">
        <h2>N/A</h2>
      </div>
      <Draggable
        v-model="sortedItems.unsorted"
        tag="div"
        class="row"
        group="items"
        item-key="id"
      >
        <template #item="{ element: item }">
          <div class="item">{{ item.name }}</div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ModelRef } from "vue";
import Draggable from "vuedraggable";
import _ from "lodash";

const user = useSupabaseUser();

const items: ModelRef<any[]> = defineModel("items", {
  default: [],
});

watch(items, (newItems) => {
  console.log(newItems);
});

const getItem = (id: number) => {
  return items.value.find((item) => item.id === id);
};

const { data: tierlistRawData, refresh } = await useFetch("/api/tierlist/get");

const userSortedItems = computed(() => {
  //subscribers
  items.value;
  //logic
  console.log("rebuilding...");
  const sortedItems: Record<string, any[]> = {
    sTier: [],
    aTier: [],
    bTier: [],
    cTier: [],
    dTier: [],
    eTier: [],
    fTier: [],
    unsorted: [],
  };
  // assign tiered items
  tierlistRawData.value?.forEach(({ item_id, tier }) => {
    switch (tier) {
      case "s":
        sortedItems.sTier.push(getItem(item_id));
        break;
      case "a":
        sortedItems.aTier.push(getItem(item_id));
        break;
      case "b":
        sortedItems.bTier.push(getItem(item_id));
        break;
      case "c":
        sortedItems.cTier.push(getItem(item_id));
        break;
      case "d":
        sortedItems.dTier.push(getItem(item_id));
        break;
      default:
        sortedItems.unsorted.push(getItem(item_id));
        break;
    }
  });
  sortedItems.unsorted.push(
    ...items.value.filter((item) => {
      return !Object.values(sortedItems)
        .flat()
        .some((sortedItem) => sortedItem.id === item.id);
    })
  );
  console.log(sortedItems);
  return sortedItems;
});

const sortedItems = ref<Record<string, any[]>>({ ...userSortedItems.value });

watch(userSortedItems, (newUserSortedItems) => {
  sortedItems.value = { ...newUserSortedItems };
});

function cancelChanges() {
  sortedItems.value = { ...userSortedItems.value };
}

async function saveChanges() {
  const user_id = user.value?.id as string;
  const allItems = unref(sortedItems);
  const getTier = (item: any): string | null => {
    switch (true) {
      case allItems.sTier.includes(item):
        return "s";
      case allItems.aTier.includes(item):
        return "a";
      case allItems.bTier.includes(item):
        return "b";
      case allItems.cTier.includes(item):
        return "c";
      case allItems.dTier.includes(item):
        return "d";
      default:
        return null;
    }
  };

  const newVotes: {
    item_id: number;
    user_id: string;
    tier: string;
  }[] = [];

  Object.values(sortedItems.value).forEach((items) => {
    items.forEach((item) => {
      const tier = getTier(item);
      if (!tier) return;
      newVotes.push({
        item_id: item.id,
        user_id,
        tier,
      });
    });
  });
  await $fetch("/api/tierlist/save", {
    method: "POST",
    body: {
      newVotes,
    },
  });
  refresh();
  console.log(
    userSortedItems.value,
    sortedItems.value,
    _.isEqual(userSortedItems.value, sortedItems.value)
  );
}

const isEditing = computed<boolean>(
  () => !_.isEqual(userSortedItems.value, sortedItems.value)
);
</script>

<style scoped>
.tierlist {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  margin: 0 20px;
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 110px;
  padding: 15px;
  border: 1px solid black;
}
h2 {
  width: fit-content;
}
.row {
  min-height: 120px;
  border: black;
  background-color: rgb(62, 62, 62);
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  border-bottom: 1px solid black;
  &:last-child {
    border-bottom: none;
  }
}
.item {
  height: 100px;
  aspect-ratio: 1/1;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>

const hole: Hobbit[] = []; const aHobbit = new Hobbit(); hole.push(aHobbit);
assert(!hole.sale && !hole.deplaisant) assert(hole instanceof Hobbit[])
