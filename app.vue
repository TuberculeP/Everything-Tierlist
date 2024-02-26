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
    <NuxtPage />
  </div>
</template>
