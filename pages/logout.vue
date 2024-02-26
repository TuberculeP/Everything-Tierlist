<script lang="ts" setup>
const supabase = useSupabaseClient();
supabase.auth.signOut();
navigateTo("/login");
</script>
<template>
  <div>
    <h1>Logging out...</h1>
  </div>
</template>
