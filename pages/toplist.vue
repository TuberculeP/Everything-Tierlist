<template>
  <div>
    <h1>Everything Top List</h1>
    <UAlert
      v-if="topListRows[0].author_id === user?.id"
      class="my-5 w-1/2"
      variant="outline"
      color="primary"
      title="Congratulations !"
      description="One of your additions is in first position !"
    />
    <div class="toplist">
      <UTable
        :columns="columns"
        v-model:sort="sort"
        :rows="rowsPerPage"
        sort-mode="manual"
      >
        <template #author-data="{ row }">
          <UBadge
            v-if="row.author_id === user?.id"
            size="xs"
            label="Me"
            color="emerald"
            variant="subtle"
          />
        </template>
        <template #name-data="{ row }">
          <UTooltip :text="row.name">
            <p class="truncate w-[200px]">{{ row.name }}</p>
          </UTooltip>
        </template>
      </UTable>
      <UPagination
        v-model="page"
        :page-count="perPage"
        :total="topListRows.length"
        class="mx-auto my-5 w-fit"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import _ from "lodash";
const user = useSupabaseUser();
const { data } = await useFetch<{ item_id: string; total_score: number }[]>(
  "/api/items/item-score"
);

const perPage = 10;
const page = ref(1);

const { data: allItems } = await useFetch<Record<string, any>[]>(
  "/api/items/all"
);

const sort = ref<{ column: string; direction: "asc" | "desc" }>({
  column: "rank",
  direction: "asc",
});

const topListData = computed(() =>
  data.value && allItems.value
    ? data.value.map((item) => ({
        ...item,
        name: _.find(allItems.value, { id: item.item_id })?.name,
      }))
    : []
);

const topListRows = computed(() =>
  _.orderBy(
    topListData.value.map(({ item_id, name, total_score }, i) => {
      const additionalClass: string | null =
        i === 0
          ? "podium first bg-amber-400 animate-bounce"
          : i === 1
          ? "podium second bg-slate-300"
          : i === 2
          ? "podium third bg-orange-500"
          : null;
      return {
        rank: i + 1,
        name,
        author_id: allItems.value?.find((item) => item.id === item_id)?.user_id,
        class: additionalClass ?? "",
      };
    }),
    "rank",
    sort.value.direction
  )
);

const rowsPerPage = computed(() =>
  topListRows.value.slice((page.value - 1) * perPage, page.value * perPage)
);

const columns = [
  {
    key: "rank",
    label: "#",
    sortable: true,
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "author",
    label: "Author",
  },
];
</script>

<style scoped lang="scss">
.toplist {
  &:deep(.podium) {
    td {
      color: black;
    }
    &.first {
      td {
        font-weight: 600;
      }
    }
  }
}
</style>
