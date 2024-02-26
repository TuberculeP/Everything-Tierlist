<script setup lang="ts">
const supabase = useSupabaseClient();

const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/confirm",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  if (error) console.log(error);
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.log(error);
};
</script>
<template>
  <button @click="signInWithOAuth">Click</button>
</template>
