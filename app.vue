<script setup lang="ts">
const user = useUser();
const links = [
  {
    label: "My tierlist",
    icon: "i-heroicons-presentation-chart-line",
    to: "/",
  },
  {
    label: "Top List",
    icon: "i-heroicons-chart-bar",
    to: "/toplist",
  },
  {
    label: "Account",
    to: "/account",
    avatar: {
      src: user?.value.avatar,
    },
  },
];
onMounted(() => {
  document.title = "Everything Tierlist";
});
</script>
<template>
  <NuxtLoadingIndicator color="black" />
  <div class="tierlist-app">
    <header
      class="flex border-b border-gray-200 justify-between pt-2 px-6 pb-0"
    >
      <NuxtLink to="/" class="flex items-center gap-5">
        <h1 class="font-semibold">Everything TierList</h1>
      </NuxtLink>
      <template v-if="user?.id">
        <UHorizontalNavigation :links="links" class="w-fit" />
      </template>
    </header>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");

* {
  font-family: "Inter", sans-serif;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

:root {
  font-size: 14px;
}

div.tierlist-app {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
}
main {
  height: 100%;
  overflow: scroll;
  > div {
    width: 90%;

    max-width: 1000px;
    margin: 0 auto;
  }
  h1 {
    font-weight: 600;
    font-size: 2rem;
    margin: 20px 0;
  }
}
</style>
