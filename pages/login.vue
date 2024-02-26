<script setup lang="ts">
const supabase = useSupabaseClient();
const { host, protocol } = useRequestURL();
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
  <div class="login">
    <button @click="signInWithOAuth">
      <img src="/google.png" class="google-icon" alt="icon google" />
      <p>Login with Google</p>
    </button>
  </div>
</template>
<style>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.login button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px 15px;
  background-color: white;
  border: 2px solid black;
  border-radius: 50px;
  cursor: pointer;
}
.login .google-icon {
  width: 30px;
  height: 30px;
}
</style>
