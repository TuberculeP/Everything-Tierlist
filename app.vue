<script setup lang="ts">
onMounted(() => {
  document.title = "Everything Tierlist";
});
const user = useSupabaseUser();
</script>
<template>
  <NuxtLoadingIndicator color="black" />
  <div class="tierlist-app">
    <header>
      <div class="logo">
        <NuxtLink to="/">
          <img src="/logo.png" alt="" />
          <h1>Everything Tierlist</h1>
        </NuxtLink>
      </div>
      <nav>
        <template v-if="user">
          <NuxtLink to="/toplist">Top List</NuxtLink>
          <NuxtLink to="/account">Account</NuxtLink>
          <NuxtLink to="/logout">Logout</NuxtLink>
        </template>
      </nav>
    </header>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>
<style lang="scss">
* {
  font-family: Arial, sans-serif;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
div.tierlist-app {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
}
main {
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  > div {
    margin: 15px;
  }
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid gray;
  div.logo > a {
    user-select: none;
    display: flex;
    gap: 10px;
    align-items: center;
    text-decoration: none;
    color: black;
    cursor: pointer;
    img {
      height: 60px;
    }
    h1 {
      font-size: 1.5rem;
    }
  }
  nav {
    display: flex;
    gap: 20px;
    align-items: center;
    a {
      text-decoration: none;
      color: black;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
