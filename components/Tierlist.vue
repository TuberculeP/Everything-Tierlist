<template>
  <div :class="{ with_pin: isNaPinned }">
    <div class="menu" v-if="isEditing">
      <button class="cancel" @click="cancelChanges">
        Annuler les changements
      </button>
      <button class="save" @click="saveChanges">Sauvegarder</button>
    </div>
    <UContextMenu
      v-model="isOpen"
      :virtual-element="virtualElement"
      :popper="{ placement: 'right' }"
    >
      <div class="p-4 flex flex-col">
        <UTooltip :text="getItem(currentContextId)?.name">
          <h3 class="font-semibold max-w-[200px] truncate">
            {{ getItem(currentContextId)?.name }}
          </h3>
        </UTooltip>
        <UDivider class="my-2" />
        <UDropdown
          :popper="{ placement: 'right' }"
          :items="getContextDropdownItems(currentContextId)"
        >
          <template #item="{ item }">
            <Icon
              :style="'color: ' + item.color"
              name="i-heroicons-folder-solid"
            />
            <p>{{ item.label }}</p>
          </template>
          <UButton
            color="gray"
            variant="ghost"
            label="Send to"
            trailing-icon="i-heroicons-chevron-right-20-solid"
          />
        </UDropdown>
        <UAccordion :items="[{ label: 'Stats', slot: 'stats' }]">
          <template #default="{ open }">
            <UButton
              color="gray"
              variant="ghost"
              >Display stats
              <template #trailing>
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="w-5 h-5 ms-auto transform transition-transform duration-200"
                  :class="[open && 'rotate-90']"
                /> </template
            ></UButton>
          </template>
          <template #stats>
            <div class="visualizer" v-if="viewingId">
              <p v-if="viewingLoading">Loading data...</p>
              <div class="w-[250px]" v-else>
                <p>Stats on {{ viewingData?.total_votes }} votes</p>
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
                    borderColor: 'rgb(55,65,81)',
                  }"
                />
              </div>
            </div>
          </template>
        </UAccordion>
      </div>
    </UContextMenu>
    <div class="tierlist">
      <template
        v-for="(tier, idx) in Object.keys(sortedItems)"
        :key="tier + idx"
      >
        <div class="title" :style="{ background: tierData[tier].color }">
          <h2>{{ tierData[tier].label }}</h2>
        </div>
        <Draggable
          v-model="sortedItems[tier]"
          tag="div"
          class="row"
          group="items"
          item-key="id"
          @end="changes++"
        >
          <template #item="{ element: item }">
            <UCard
              class="w-100 text-sm"
              @contextmenu.prevent="onContextMenu(item.id)"
              :ui="{ body: '' }"
            >
              <div class="p-2">
                <UTooltip :text="item.name"
                  ><p class="truncate max-w-[150px]">
                    {{ item.name }}
                  </p></UTooltip
                >
              </div>
            </UCard>
          </template>
        </Draggable>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Draggable from "vuedraggable";
import _ from "lodash";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Doughnut } from "vue-chartjs";
import { useMouse, useWindowScroll } from "@vueuse/core";
import { _borderWidth } from "#tailwind-config/theme";

const { $toast } = useNuxtApp();
const { start, finish } = useLoadingIndicator({
  duration: 2000,
  throttle: 200,
});
const user = useSupabaseUser();
const client = useSupabaseClient();
const { x, y } = useMouse();
const { y: windowY } = useWindowScroll();

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
  console.log("???");
  sortedItems.value = { ...newUserSortedItems };
});

const getItemTier = (id: number) => {
  const item = getItem(id);
  if (!item) return "unsorted";
  if (sortedItems.value.sTier.includes(item)) return "sTier";
  if (sortedItems.value.aTier.includes(item)) return "aTier";
  if (sortedItems.value.bTier.includes(item)) return "bTier";
  if (sortedItems.value.cTier.includes(item)) return "cTier";
  if (sortedItems.value.dTier.includes(item)) return "dTier";
  return "unsorted";
};

const tierData: Record<string, { label: string; color: string }> = {
  sTier: {
    label: "S",
    color: "rgb(255, 127, 127)",
  },
  aTier: {
    label: "A",
    color: "rgb(255, 223, 127)",
  },
  bTier: {
    label: "B",
    color: "rgb(255, 255, 127)",
  },
  cTier: {
    label: "C",
    color: "rgb(127, 255, 127)",
  },
  dTier: {
    label: "D",
    color: "rgb(127, 255, 255)",
  },
  unsorted: {
    label: "Unsorted",
    color: "rgb(127, 127, 127)",
  },
};

function cancelChanges() {
  sortedItems.value = _.cloneDeep({ ...unref(userSortedItems) });
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
const changes = ref(0);
const isEditing = computed<boolean>(() => {
  changes.value;
  console.log(toRaw(userSortedItems.value), toRaw(sortedItems.value));
  return !_.isEqual(toRaw(userSortedItems.value), toRaw(sortedItems.value));
});

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
const isOpen = ref(false);
const virtualElement = ref({ getBoundingClientRect: () => ({}) });

const currentContextId = ref(0);
function onContextMenu(id: number) {
  currentContextId.value = id;
  viewingId.value = id;

  const top = unref(y) - unref(windowY);
  const left = unref(x);

  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    top,
    left,
  });

  isOpen.value = true;
}

const getContextDropdownItems = (id: number, currentTier: string) => {
  return [
    Object.values(tierData).map((tier) => ({
      ...tier,
      click: () => {
        const label = tier.label.toLowerCase();
        const newTier = label === "unsorted" ? label : label + "Tier";
        const oldTier = getItemTier(id);
        const itemIdx = sortedItems.value[oldTier].findIndex(
          (item: any) => item.id === id
        );
        const item = sortedItems.value[oldTier][itemIdx];
        if (!item) return;
        sortedItems.value[newTier] = [...sortedItems.value[newTier], item];
        sortedItems.value[oldTier] = sortedItems.value[oldTier].filter(
          (item: any) => item.id !== id
        );
        changes.value++;
        isOpen.value = false;
      },
    })),
  ];
};
</script>

<style scoped lang="scss">
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
}
h2 {
  width: fit-content;
}

.row {
  min-height: 120px;
  background-color: rgb(62, 62, 62);
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
  position: relative;
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
