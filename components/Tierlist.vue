<template>
  <div :class="{ with_pin: isNaPinned }">
    <div class="menu" v-if="isEditing">
      <button class="cancel" @click="cancelChanges">
        Annuler les changements
      </button>
      <button class="save" @click="saveChanges">Sauvegarder</button>
    </div>
    <div class="tierlist">
      <div class="title" style="background: rgb(255, 127, 127)">
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
          <div class="item">
            {{ item.name }}
            <button @click="viewingId = item.id">
              <Icon name="mdi:information-outline" color="black" />
            </button>
          </div>
        </template>
      </Draggable>
      <div class="title" style="background: rgb(255, 223, 127)">
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
          <div class="item">
            {{ item.name }}
            <button @click="viewingId = item.id">
              <Icon name="mdi:information-outline" color="black" />
            </button>
          </div>
        </template>
      </Draggable>
      <div class="title" style="background: rgb(255, 255, 127)">
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
          <div class="item">
            {{ item.name }}
            <button @click="viewingId = item.id">
              <Icon name="mdi:information-outline" color="black" />
            </button>
          </div>
        </template>
      </Draggable>
      <div class="title" style="background: rgb(127, 255, 127)">
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
          <div class="item">
            {{ item.name }}
            <button @click="viewingId = item.id">
              <Icon name="mdi:information-outline" color="black" />
            </button>
          </div>
        </template>
      </Draggable>
      <div class="title" style="background: rgb(127, 255, 255)">
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
          <div class="item">
            {{ item.name }}
            <button @click="viewingId = item.id">
              <Icon name="mdi:information-outline" color="black" />
            </button>
          </div>
        </template>
      </Draggable>
      <div class="n-a" :class="{ pinned: isNaPinned }">
        <button class="pin" @click="isNaPinned = !isNaPinned">{{isNaPinned ? "Unpin" : "Pin"}}</button>
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
            <div class="item">
              {{ item.name }}
              <button @click="viewingId = item.id">
                <Icon name="mdi:information-outline" color="black" />
              </button>
            </div>
          </template>
        </Draggable>
      </div>
    </div>
    <div class="visualizer" v-if="viewingId">
      <p>{{ viewingId }}</p>
      <p v-if="viewingLoading">Loading data...</p>
      <div
        v-else
        style="
          height: 500px;
          display: flex;
          align-items: center;
          flex-direction: column;
          text-align: center;
        "
      >
        <h1>{{ getItem(viewingId)?.name }}</h1>
        <p>{{ viewingData?.total_votes }} votes</p>
        <Doughnut
          :data="{
            labels: ['S', 'A', 'B', 'C', 'D'],
            datasets: [
              {
                backgroundColor: [
                  'rgb(255, 127, 127)',
                  'rgb(255, 223, 127)',
                  'rgb(255, 255, 127)',
                  'rgb(127, 255, 127)',
                  'rgb(127, 255, 255)',
                ],
                data: [
                  viewingData?.s_votes || 0,
                  viewingData?.a_votes || 0,
                  viewingData?.b_votes || 0,
                  viewingData?.c_votes || 0,
                  viewingData?.d_votes || 0,
                ],
              },
            ],
          }"
          :options="{
            responsive: true,
            maintainAspectRatio: true,
            borderColor: 'black',
          }"
        />
      </div>
    </div>
    <p v-else style="margin-top: 30px">
      Info <Icon name="mdi:information-outline" color="black" /> on one item to
      fetch stats.
    </p>
  </div>
</template>

<script lang="ts" setup>
import Draggable from "vuedraggable";
import _ from "lodash";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Doughnut } from "vue-chartjs";

const { $toast } = useNuxtApp();
const { start, finish } = useLoadingIndicator({
  duration: 2000,
  throttle: 200,
});
const user = useSupabaseUser();
const client = useSupabaseClient();
const { data: items, refresh: refreshItems } = await useFetch<
  { id: number; name: string; user_id: string }[]
>("/api/items/all");
const { data: tierlistRawData, refresh } = await useFetch("/api/tierlist/get");

const getItem = (id: number) => {
  return items.value?.find((item) => item.id === id);
};

const userSortedItems = computed(() => {
  //subscribers
  items.value;
  //logic
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
  if (!items.value) return sortedItems;
  sortedItems.unsorted.push(
    ...items.value.filter((item) => {
      return !Object.values(sortedItems)
        .flat()
        .some((sortedItem) => sortedItem.id === item.id);
    })
  );
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
  start();
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
  await refresh();
  finish();
  $toast.success("Tierlist saved !");
}

const isEditing = computed<boolean>(
  () => !_.isEqual(userSortedItems.value, sortedItems.value)
);

const isDataOutdated = ref(false);

let realtimeChannel: RealtimeChannel;

// Once page is mounted, listen to changes on the `collaborators` table and refresh collaborators when receiving event
onMounted(() => {
  // Real time listener for new workouts
  realtimeChannel = client
    .channel("public:items")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "items" },
      () => {
        if (!isDataOutdated.value) {
          $toast.info("New items added, save and refresh to see new stuff !", {
            duration: 0,
          });
        }
        isDataOutdated.value = true;
      }
    );

  realtimeChannel.subscribe();
});

// Don't forget to unsubscribe when user left the page
onUnmounted(() => {
  client.removeChannel(realtimeChannel);
});

const viewingId = ref<number>(0);
const viewingLoading = ref(false);
const viewingData = ref<null | Record<string, number>>(null);
watch(
  () => viewingId.value,
  async (newViewingId) => {
    if (!newViewingId) return (viewingData.value = null);
    viewingLoading.value = true;
    const data = await $fetch<Record<string, number>>(`/api/items/stats`, {
      method: "post",
      body: { id: newViewingId },
    });
    viewingData.value = data;
    viewingLoading.value = false;
  }
);

const isNaPinned = ref(false);
</script>

<style scoped lang="scss">
.with_pin {
  margin-bottom: 200px;
}
.tierlist {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  margin: 0 20px;
  row-gap: 20px;
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
.n-a {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1/-1;
  position: relative;
}
.n-a.pinned {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  grid-template-columns: auto 1fr;
}
.n-a > button.pin {
  position: absolute;
  top: 10px;
  left: 10px;
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
  max-height: 200px;
  overflow-y: auto;
  position: relative;
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
  position: relative;
  > button {
    position: absolute;
    top: 3px;
    right: 3px;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
}

.menu {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px;
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    &.cancel {
      background-color: red;
    }
    &.save {
      background-color: green;
    }
  }
}
</style>
