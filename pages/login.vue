<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
console.log(user.value);
const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
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
