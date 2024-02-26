<script setup lang="ts">
const supabase = useSupabaseClient();
const {host, protocol} = useRequestURL();
const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${protocol}//${host}/confirm`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  if (error) console.log(error);
};
</script>
<template>
  <button @click="signInWithOAuth">Click</button>
</template>
