<script setup lang="ts">
const user = useSupabaseUser();
</script>
<template>
  <div>
    <header>
      <nuxt-link to="/">Home</nuxt-link>
      <template v-if="user">
        <nuxt-link to="/account">Account</nuxt-link>
        <nuxt-link to="/logout">Logout</nuxt-link>
      </template>
    </header>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>
<style>
* {
  font-family: Arial, sans-serif;
  padding: 0;
  margin: 0;
}
main {
  max-width: 1000px;
  margin: 20px auto;
}
</style>
